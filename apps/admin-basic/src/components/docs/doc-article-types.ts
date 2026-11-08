/** Content contract for DocArticle — bilingual doc pages feed these in. */
export interface DocSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  code?: string;
  codeLanguage?: string;
}
