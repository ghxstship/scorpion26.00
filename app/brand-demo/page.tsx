'use client';

import React from 'react';
import {
  BrandTitle,
  BrandSubtitle,
  BrandH1,
  BrandH2,
  BrandH3,
  BrandH4,
  BrandBody,
  BrandButton,
  BrandCaption,
} from '@/components/branding/typography';
import { ThemeSwitcher } from '@/components/branding/theme-switcher';
import { useBrand } from '@/lib/branding/brand-context';

/**
 * Brand Demo Page
 * Showcases the white-label typography and theming system
 */
export default function BrandDemoPage() {
  const { theme } = useBrand();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Brand White-Label System</h1>
          <p className="text-muted-foreground">
            Active Theme: <span className="font-semibold">{theme.name}</span>
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Typography Showcase */}
      <div className="space-y-16">
        {/* Title */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Title Typography</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.title}
            </p>
          </div>
          <BrandTitle>TITLE ANTON SC</BrandTitle>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.title} | Usage: Main page titles, hero headlines
          </div>
        </section>

        {/* Subtitle */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Subtitle Typography</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.subtitle}
            </p>
          </div>
          <BrandSubtitle>Subtitle Contrail One</BrandSubtitle>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.subtitle} | Usage: Taglines, subheadings
          </div>
        </section>

        {/* Heading 1 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Heading 1</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.heading1}
            </p>
          </div>
          <BrandH1>HEADING 1 BEBAS NEUE</BrandH1>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.h1} | Usage: Section headers, major headings
          </div>
        </section>

        {/* Heading 2 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Heading 2</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.heading2}
            </p>
          </div>
          <BrandH2>HEADING 2 BEBAS NEUE</BrandH2>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.h2} | Usage: Subsection headers
          </div>
        </section>

        {/* Heading 3 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Heading 3</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.heading3}
            </p>
          </div>
          <BrandH3>HEADING 3 OSWALD</BrandH3>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.h3} | Usage: Card titles, component headers
          </div>
        </section>

        {/* Heading 4 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Heading 4</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.heading4}
            </p>
          </div>
          <BrandH4>HEADING 4 OSWALD</BrandH4>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.h4} | Usage: Smaller section headers
          </div>
        </section>

        {/* Body Text */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Body Typography</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.body}
            </p>
          </div>
          <BrandBody>
            Body Roboto Mono - This is the body text that will be used throughout the application
            for paragraphs, descriptions, and general content. It should be highly readable and
            comfortable for extended reading sessions. The monospace font provides a technical,
            modern aesthetic that aligns with the fitness brand&apos;s precision and performance focus.
          </BrandBody>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.body} | Usage: Body text, descriptions, content
          </div>
        </section>

        {/* Button Text */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Button Typography</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.button}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
              <BrandButton>Get Started</BrandButton>
            </button>
            <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg">
              <BrandButton>Learn More</BrandButton>
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.button} | Usage: Button labels, CTAs
          </div>
        </section>

        {/* Caption */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Caption Typography</h2>
            <p className="text-sm text-muted-foreground">
              Font: {theme.typography.caption}
            </p>
          </div>
          <BrandCaption>
            Caption text - Used for small labels, metadata, and supplementary information
          </BrandCaption>
          <div className="text-sm text-muted-foreground">
            Size: {theme.typography.sizes.caption} | Usage: Captions, labels, metadata
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Color Palette</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-primary rounded-lg"></div>
              <p className="text-sm font-semibold">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-secondary rounded-lg"></div>
              <p className="text-sm font-semibold">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-accent rounded-lg"></div>
              <p className="text-sm font-semibold">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-muted rounded-lg"></div>
              <p className="text-sm font-semibold">Muted</p>
            </div>
          </div>
        </section>

        {/* Complete Example */}
        <section className="space-y-6 bg-card p-8 rounded-lg border">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Complete Example</h2>
            <p className="text-sm text-muted-foreground">
              All typography elements working together
            </p>
          </div>
          
          <BrandTitle className="text-center">TRANSFORM YOUR BODY</BrandTitle>
          <BrandSubtitle className="text-center">In Just 90 Days</BrandSubtitle>
          
          <div className="space-y-6 mt-8">
            <BrandH1>OUR PROGRAMS</BrandH1>
            <BrandBody>
              Discover science-backed fitness programs designed to help you achieve your goals.
              Whether you&apos;re a beginner or an advanced athlete, we have the perfect program for you.
            </BrandBody>
            
            <BrandH2>STRENGTH TRAINING</BrandH2>
            <BrandBody>
              Build muscle, increase strength, and transform your physique with our comprehensive
              strength training programs.
            </BrandBody>
            
            <BrandH3>BEGINNER LEVEL</BrandH3>
            <BrandBody>
              Perfect for those just starting their fitness journey. Learn proper form, build a
              foundation, and develop healthy habits.
            </BrandBody>
            
            <div className="flex gap-4 mt-6">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
                <BrandButton>Start Now</BrandButton>
              </button>
              <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg">
                <BrandButton>View Details</BrandButton>
              </button>
            </div>
            
            <BrandCaption className="block mt-4">
              * Results may vary. Consult with a healthcare professional before starting any fitness program.
            </BrandCaption>
          </div>
        </section>
      </div>
    </div>
  );
}
