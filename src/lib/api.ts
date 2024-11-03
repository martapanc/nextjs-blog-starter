import {Post} from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import {join} from "path";

const postsDirectory = join(process.cwd(), "public/_posts");

export function getPostSlugs() {
    return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(postsDirectory, `${realSlug}.md`);
    try {
        if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const {data, content} = matter(fileContents);

            return {...data, slug: realSlug, content} as Post;
        } else {
            console.warn(`File ${slug} not found`);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function getAllPosts(): Post[] {
    const slugs = getPostSlugs();
    return slugs
        .map((slug) => getPostBySlug(slug))
        .filter(post => post !== null)
        // sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}
