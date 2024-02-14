
// place files you want to import through the `$lib` alias in this folder.

export async function Creds() {
	const { key, cert } = await (await fetch("/api/creds")).json();

	return { key, cert };
}