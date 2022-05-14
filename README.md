# IMPORTANT!
Mainline development has ceased due to the lack of interest & time to supply Borealis with new functions. Fork the repository if you want to continue developing - you don't have to ask me for a consent to do so.

# What's this?
This is the source code of Borealis bot, currently private but main instance will be public soon. You can selfhost it, you can even extend bot's existing functions by new ones - but remember that the changes you've made should be open-source, too. This is how open-source works, right?

# What you will need?
To start up the bot, you will need the following:
- Typescript v4.6.3
- packages from `/package.json` (you can bulk install them via `npm install`)

One thing to note - TypeScript files CANNOT be launched directly "from the source" because Typescript needs to be compiled every single time you've made the changes (via `tsc` command in the root folder of the codebase).
But don't worry, TypeScript compiles to JavaScript. All you need to know that TS differs from the JS the method used to import entire packages and/or modules. Instead of:
```js
const {module} = require('package');
```
Typescript uses:
```ts
import "module" from "package";
```
However, most of the JavaScript syntax remain in TypeScript "as is", so to use TypeScript you need to know JS basics (and know how to use typings properly - more on TypeScript docs). That's all!

# To-do list
- complete /config slash subcommand events (`messageDelete.ts`, `guildMemberAdd.ts`, `guildMemberRemove.ts`)

# Questions, suggestions or found any bugs?
Post them on GitHub Issue Tracker (`Issues` tab).
