

export async function CopyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function CopyBlogToClipboard(blogId: string) {
  await CopyToClipboard(`http://localhost:4200/Blogs/${blogId}`);
}
