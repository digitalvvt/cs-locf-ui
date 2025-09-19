import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

const MetaTags = ({
  title = "LOCF VVT SOLUTIONS",
  description = "CS LOCF - Computer Science Learning Outcome and Curriculum Framework",
  keywords = "education, computer science, curriculum, learning outcomes",
  ogTitle = "LOCF VVT SOLUTIONS",
  ogDescription = "Computer Science Learning Outcome and Curriculum Framework",
  ogImage = "/logo.png",
  twitterCard = "summary_large_image",
  twitterSite = "@cslocf",
  twitterCreator = "@cslocf",
}: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter meta tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
    </Helmet>
  );
};

export default MetaTags;
