import { Context } from "detritus-client/lib/command";
import Client from "../structures/client";
import { Role, ChannelGuildText } from "detritus-client/lib/structures";
import { ShardClient } from "detritus-client";

export default {
    name: "verify",
    metadata: {
        description: "Request or use a verification code to verify yourself as a human"
    },
    run: async (client: Client, ctx: Context) => {
        const channels = (<ShardClient>client.client).channels;
        const channel: ChannelGuildText = channels.get(ctx.channelId) || await client.rest.fetchChannel(ctx.channelId);

        if (!channels.has(ctx.channelId)) {
            channels.set(ctx.channelId, channel);
        }

        if (!ctx.guildId || !ctx.member || !channel) return;
        if (client.boundTo !== null && channel.name !== client.boundTo) return;

        if (client.boundTo !== null) {
            await ctx.message.delete();
        }

        const [, ...args] = ctx.content.split(" ");
        const userId = BigInt(ctx.userId);

        if (args.length === 0) {
            const maybeQueueEntry = client.queue.get(userId);

            // If the user has already requested a captcha, we also want to check if it's still valid
            // If it isn't, we can delete it from the queue and generate a new one.
            if (maybeQueueEntry) {
                if (Date.now() - maybeQueueEntry.requestedAt >= client.timeouts.captcha) {
                    client.queue.delete(userId);
                } else {
                    return client.temporaryEditOrReply(
                        ctx, 
                        client.messages.alreadyRequestedVerificationCode, 
                        client.timeouts.alreadyRequestedVerificationCode
                    );
                }
            }

            const buff = await client.createCaptcha(userId);

            await client.temporaryEditOrReply(ctx, {
                file: {
                    data: buff,
                    filename: "captcha.jpeg"
                }
            }, client.timeouts.captcha);
            return;
        }

        const code = client.queue.get(userId);
        if (code === undefined || code.code !== args[0]) {
            return client.temporaryEditOrReply(ctx, client.messages.invalidCode, client.timeouts.invalidCode);
        }

        // User provided a valid captcha, so we can remove the captcha from the queue now
        client.queue.delete(userId);

        const roles: Role[] = await client.rest.fetchGuildRoles(ctx.guildId);
        const verifiedRole: Role | undefined = roles.find(v => v.name.toLowerCase() === client.roleName);
        if (!verifiedRole) {
            return client.temporaryEditOrReply(ctx, client.messages.roleNotFound, client.timeouts.roleNotFound);
        }

        if (ctx.member.roles.has(verifiedRole.id)) {
            return client.temporaryEditOrReply(ctx, client.messages.alreadyVerified, client.timeouts.alreadyVerified);
        }

        try {
            await ctx.rest.addGuildMemberRole(ctx.guildId, ctx.userId, verifiedRole.id);
            return client.temporaryEditOrReply(ctx, client.messages.successfullyVerified, client.timeouts.successfullyVerified);
        } catch(e) {
            return client.temporaryEditOrReply(ctx, client.messages.verifyError + e.message, client.timeouts.verifyError);
        }
    }
}