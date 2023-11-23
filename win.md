1. Install choco (https://chocolatey.org/install)
1. `choco feature enable -n allowGlobalConfirmation`
1. `choco install nvm.install`
1. `nvm list available`
1. `nvm install xxx`
1. `npm i -g zx`
1. `zx --install pc-init.js`

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
npm link @marcuson/scriptman

To run the example, launch `zx scriptman steps.ts`
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
