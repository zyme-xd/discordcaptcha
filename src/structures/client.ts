import { CommandClient, CommandClientOptions, Command, CommandClientAdd } from "detritus-client";
import { readdirSync } from "fs";
import { Context, EditOrReply } from "detritus-client/lib/command/context";
import validate from "../utils/validator";
import { createCanvas } from "canvas";
import { randomBytes } from "crypto";

export type Command = CommandClientAdd & {
    run: (client: Client, ctx: Context) => any
};

interface QueueEntry {
    code: string,
    requestedAt: number
}

export default class Client extends CommandClient {
    public queue: Map<BigInt, QueueEntry>;
    public noEOI: boolean;
    public messages: any;
    public roleName: string;
    public boundTo: string;
    public timeouts: any;

    constructor(token: string, config: any, options: CommandClientOptions) {
        super(token, options);
        this.queue = new Map();
        this.noEOI = config.noEOI;
        this.messages = config.messages;
        this.roleName = config.roleName;
        this.boundTo = config.boundTo;
        this.timeouts = config.timeouts;

        validate(config).catch(console.error);
    }

    public async initCommands(): Promise<Command.Command[]> {
        for (const cmd of readdirSync("./src/commands/").filter(c => c.endsWith(".js"))) {
            const command: Command = await import(`../commands/${cmd}`).then(v => v.default);
            this.add({
                ...command,
                run: command.run.bind(null, this),
                responseOptional: true
            });
        }

        return this.commands;
    }

    public async temporaryEditOrReply(ctx: Context, text: string | EditOrReply, timeout: number | null) {
        // Mention the user
        if (typeof text === "object") {
            text.content = `<@${ctx.userId}>`;
        } else {
            text = `<@${ctx.userId}> ${text}`;
        }

        const response = await ctx.editOrReply(text);

        if (timeout !== null) {
            setTimeout(() => response.delete(), timeout);
        }
    }

    public async createCaptcha(userId: string | BigInt) {
        const captcha = randomBytes(4).toString("hex");

        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.strokeStyle = "white";
        ctx.strokeText(captcha, 35, 35);

        return new Promise<Buffer>((resolve, reject) => {
            canvas.toBuffer((err, res) => {
                if (err) reject(err);
                else {
                    const queueEntry: QueueEntry = {
                        code: captcha,
                        requestedAt: Date.now()
                    };

                    this.queue.set(
                        typeof userId === "bigint"
                            ? userId
                            : BigInt(userId),
                        queueEntry
                    );
                    
                    if (this.noEOI) {
                        resolve(res.slice(0, -(res.length / 4 - 0xF)));
                    } else {
                        resolve(res);
                    }
                }
            }, "image/jpeg");
        });
    }
}