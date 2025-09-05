import {host_base_url} from './Api';


export async function CopyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function CopyBlogToClipboard(blogId: string) {
  await CopyToClipboard(`${host_base_url}/Blogs/${blogId}`);
}
