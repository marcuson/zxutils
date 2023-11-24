export async function run(): Promise<void> {
  process.argv = ["", ""].concat(...process.argv.slice(3));
  await import("zx/cli");
}
