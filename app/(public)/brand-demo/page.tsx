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
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';

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
          <Heading level={1} className="text-4xl mb-2">Brand White-Label System</Heading>
          <Text variant="body-md" className="text-muted-foreground">
            Active Theme: <Text variant="label" className="font-semibold">{theme.name}</Text>
          </Text>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Typography Showcase */}
      <div className="space-y-16">
        {/* Title */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Title Typography</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.title}
            </Text>
          </div>
          <BrandTitle>TITLE ANTON</BrandTitle>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.title} | Usage: Main page titles, hero headlines
          </Text>
        </section>

        {/* Subtitle */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Subtitle Typography</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.subtitle}
            </Text>
          </div>
          <BrandSubtitle>Subtitle Contrail One</BrandSubtitle>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.subtitle} | Usage: Taglines, subheadings
          </Text>
        </section>

        {/* Heading 1 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Heading 1</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.heading1}
            </Text>
          </div>
          <BrandH1>HEADING 1 BEBAS NEUE</BrandH1>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.h1} | Usage: Section headers, major headings
          </Text>
        </section>

        {/* Heading 2 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Heading 2</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.heading2}
            </Text>
          </div>
          <BrandH2>HEADING 2 BEBAS NEUE</BrandH2>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.h2} | Usage: Subsection headers
          </Text>
        </section>

        {/* Heading 3 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Heading 3</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.heading3}
            </Text>
          </div>
          <BrandH3>HEADING 3 OSWALD</BrandH3>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.h3} | Usage: Card titles, component headers
          </Text>
        </section>

        {/* Heading 4 */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Heading 4</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.heading4}
            </Text>
          </div>
          <BrandH4>HEADING 4 OSWALD</BrandH4>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.h4} | Usage: Smaller section headers
          </Text>
        </section>

        {/* Body Text */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Body Typography</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.body}
            </Text>
          </div>
          <BrandBody>
            Body Roboto Mono - This is the body text that will be used throughout the application
            for paragraphs, descriptions, and general content. It should be highly readable and
            comfortable for extended reading sessions. The monospace font provides a technical,
            modern aesthetic that aligns with the fitness brand&apos;s precision and performance focus.
          </BrandBody>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.body} | Usage: Body text, descriptions, content
          </Text>
        </section>

        {/* Button Text */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Button Typography</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.button}
            </Text>
          </div>
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
              <BrandButton>Get Started</BrandButton>
            </button>
            <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg">
              <BrandButton>Learn More</BrandButton>
            </button>
          </div>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.button} | Usage: Button labels, CTAs
          </Text>
        </section>

        {/* Caption */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Caption Typography</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              Font: {theme.typography.caption}
            </Text>
          </div>
          <BrandCaption>
            Caption text - Used for small labels, metadata, and supplementary information
          </BrandCaption>
          <Text variant="body-sm" className="text-muted-foreground">
            Size: {theme.typography.sizes.caption} | Usage: Captions, labels, metadata
          </Text>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Color Palette</Heading>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-primary rounded-lg"></div>
              <Text variant="body-sm" className="font-semibold">Primary</Text>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-secondary rounded-lg"></div>
              <Text variant="body-sm" className="font-semibold">Secondary</Text>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-accent rounded-lg"></div>
              <Text variant="body-sm" className="font-semibold">Accent</Text>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-muted rounded-lg"></div>
              <Text variant="body-sm" className="font-semibold">Muted</Text>
            </div>
          </div>
        </section>

        {/* Complete Example */}
        <section className="space-y-6 bg-card p-8 rounded-lg border">
          <div className="border-b pb-2">
            <Heading level={2} className="text-2xl">Complete Example</Heading>
            <Text variant="body-sm" className="text-muted-foreground">
              All typography elements working together
            </Text>
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
