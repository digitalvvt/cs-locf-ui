import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";

interface Crumb {
  label: string;
  path?: string;
}

const resolveBreadcrumbs = (segments: string[]): Crumb[] => {
  const crumbs: Crumb[] = [];

  if (
    segments.includes("program-outcomes") &&
    segments.includes("courses") &&
    segments.length === 4
  ) {
    const programId = segments[segments.indexOf("program-outcomes") + 1];
    crumbs.push(
      { label: "Program Management", path: "/program-management" },
      { label: "Program Outcomes", path: `/program-outcomes/${programId}` },
      { label: "Course" }
    );
  } else if (segments.includes("program-outcomes")) {
    const programId = segments[segments.indexOf("program-outcomes") + 1];
    crumbs.push(
      { label: "Program Management", path: "/program-management" },
      { label: "Program Outcomes", path: `/program-outcomes/${programId}` }
    );

    // if (segments.includes("extracted-syllabus")) {
    //   crumbs.push({
    //     label: "Extracted Syllabus",
    //     path: `/program-outcomes/${programId}/extracted-syllabus`,
    //   });
    // }
  } else if (segments.includes("program-management")) {
    crumbs.push({ label: "Program Management", path: "/program-management" });
  }

  if (segments.includes("courses") && segments.length === 1) {
    crumbs.push({ label: "Courses", path: "/courses" });
  }

  if (segments.includes("question-generator")) {
    crumbs.push({ label: "Question Generator", path: "/question-generator" });
  }
  if (segments.includes("q-bank")) {
    crumbs.push({ label: "Question Bank", path: "/q-bank" });
  }
  if (segments.includes("question-history")) {
    crumbs.push({ label: "Question History", path: "/question-history" });
  }

  return crumbs;
};

export const BreadcrumbNavigation = () => {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/" || pathname === "/dashboard") return null;

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = resolveBreadcrumbs(pathSegments);

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        Home
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <span className="mx-2">/</span>
          {crumb.path ? (
            <Link to={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
