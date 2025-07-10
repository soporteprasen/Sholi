"use client";
import React from "react";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="border-y border-gray-200 py-3">
      <nav
        className="text-sm flex flex-wrap items-center gap-x-4 gap-y-2"
        aria-label="Breadcrumb"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}

            {item.href ? (
              <a
                href={item.href}
                itemProp="item"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                <span itemProp="name">{item.label}</span>
              </a>
            ) : (
              <span itemProp="name" className="font-semibold">
                {item.label}
              </span>
            )}

            <meta itemProp="position" content={index + 1} />
          </div>
        ))}
      </nav>
    </div>
  );
}
