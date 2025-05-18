import { Elysia, status } from "elysia";
import { $ } from "bun";

const app = new Elysia()
.get("/:colour/:dark", async ({params: {colour, dark}}) => {
  if (!colour.match(/[A-Fa-f0-9]{6}/g)){
    return status(400, "Incorrect syntax for colour. Needs to be hex colour string (without the hash)");
  }

  if (dark.toLowerCase() !== "true" && dark.toLowerCase() !== "false"){
    return status (400, "Incorrect syntax for dark mode. Either true or false");
  }

  const colourschemes = await $`/home/alex/.cargo/bin/matugen color hex "${colour}" --json hex`.json();

  const colourscheme = dark.toLowerCase() == "true" ? colourschemes.colors.dark : colourschemes.colors.light
  let responseData = "";
  Object.entries(colourscheme).forEach(colourValue => {
    responseData += `${colourValue[0]}:${colourValue[1]}\n`;
  });
  return responseData.trim()
})
.listen(60067);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
