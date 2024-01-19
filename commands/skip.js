const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player) return client.sendTime(message.channel, "❌ | **Müzik yok...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **bạn phải ở một phòng nào đố**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bu komutu kullanmak için kanalda olmanız gerekiyor!**");
    player.stop();
    await message.react("✅");
  },
  SlashCommand: {
    /**
 *
 * @param {import("../structures/DiscordMusicBot")} client
 * @param {import("discord.js").Message} message
 * @param {string[]} args
 * @param {*} param3
 */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Arama sırasında bir hata oluştu Bu komutu kullanmak için belirli bir odada olmalısınız.**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Arama sırasında bir hata oluştu Bu komutu kullanmak için belirli bir odada olmalısınız.**");

      const skipTo = interaction.data.options ? interaction.data.options[0].value : null;

      let player = await client.Manager.get(interaction.guild_id);

      if (!player) return client.sendTime(interaction, "❌ | **hiç müzik yok...**");
      console.log(interaction.data);
      if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, "❌ | **Invalid number to skip!**");
      player.stop(skipTo);
      client.sendTime(interaction, "**skip!**");
    },
  },
};
