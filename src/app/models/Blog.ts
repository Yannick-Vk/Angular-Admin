export interface BlogUpload {
  Title: string;
  Description: string;
  File: string;
  Author: string;
}

export interface Blog {
  id: string
  title: string;
  description: string;
  blogContent: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}
