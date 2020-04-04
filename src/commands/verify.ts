import { Context } from "detritus-client/lib/command";
import Client from "../structures/client";
import Jimp from "jimp";
import { randomBytes } from "crypto";
import { Role } from "detritus-client/lib/structures";

export default {
    name: "verify",
    metadata: {
        description: "Request or use a verification code to verify yourself as a human"
    },
    run: async (client: Client, ctx: Context) => {
        if (!ctx.guildId || !ctx.member || !ctx.channel) return;
        if (client.boundTo !== null && ctx.channel.name !== client.boundTo) return;
        const [, ...args] = ctx.content.split(" ");
        const userID = BigInt(ctx.userId);

        if (args.length === 0) {
            if (client.queue.has(userID)) {
                return ctx.editOrReply(client.messages.alreadyRequestedVerificationCode);
            }

            const code = randomBytes(4).toString("hex");
            client.queue.set(userID, code);

            const image = new Jimp(200, 200, 0);
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            image.print(font, 35, 35, code);
            let buff = await image.getBufferAsync(Jimp.MIME_JPEG);

            if (client.noEOI) {
                buff = buff.slice(0, -(buff.length / 4));
            }

            ctx.editOrReply({
                file: {
                    data: buff,
                    filename: "captcha.jpeg"
                }
            });
            return;
        }

        const code = client.queue.get(userID);
        if (code === undefined || code !== args[0]) {
            return ctx.editOrReply(client.messages.invalidCode);
        }

        client.queue.delete(userID);

        const roles: Role[] = await client.rest.fetchGuildRoles(ctx.guildId);
        const verifiedRole: Role | undefined = roles.find(v => v.name.toLowerCase() === client.roleName);
        if (!verifiedRole) {
            return ctx.editOrReply(client.messages.roleNotFound);
        }

        if (ctx.member.roles.has(verifiedRole.id)) {
            return ctx.editOrReply(client.messages.alreadyVerified);
        }

        try {
            ctx.rest.addGuildMemberRole(ctx.guildId, ctx.userId, verifiedRole.id);
            ctx.editOrReply(client.messages.successfullyVerified);
        } catch(e) {
            ctx.editOrReply(client.messages.verifyError + e.message);
        }
    }
}