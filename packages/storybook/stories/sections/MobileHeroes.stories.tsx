import type { Meta, StoryObj } from '@storybook/react';
import { Button, MobileReelHero, MobileOrbitHero, MobileLensHero } from '@paul-portfolio/react';

const images = [64, 65, 91, 177, 203, 219].map((id, index) => ({
  src: `https://picsum.photos/id/${id}/640/400`, alt: ['Portfolio', 'Design system', 'Operations', 'City explorer', 'Vitals', 'Flags'][index], href: '#work',
}));
const meta = {
  title: 'Sections/MobileHeroes', component: MobileReelHero, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' }, docs: { description: {
    component: 'Three compositions made for thumbs. Reel scrubs through every image with a native range. Orbit rotates a six-project dial with pointer and keyboard controls. Lens moves a magnifying glass across a six-project contact sheet. Tap controls offer alternatives to every drag gesture. No autoplay. CSS honours reduced motion. All keep copy and actions usable when images fail or the collection is empty.',
  } } },
  decorators: [Story => <div style={{ maxWidth: 430, marginInline: 'auto' }}><Story /></div>],
  args: { heading: <>Ideas into<br />interfaces.</>, description: 'A collection of things I built and details I couldn’t leave alone.', images,
    actions: <><Button href="#work">Explore the work</Button><Button href="#resume" variant="outline">Resume</Button></> },
} satisfies Meta<typeof MobileReelHero>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Reel: Story = {};
export const Orbit: Story = { render: args => <MobileOrbitHero {...args} /> };
export const Lens: Story = { render: args => <MobileLensHero {...args} /> };
export const Empty: Story = { args: { images: [] } };
export const Single: Story = { args: { images: images.slice(0, 1) } };
export const BrokenImage: Story = { args: { images: [{ src: '/missing-preview.webp', alt: 'Still a useful project', href: '#work' }] } };
export const DarkLens: Story = { render: args => <div data-theme="dark"><MobileLensHero {...args} /></div> };
export const LongHeading: Story = { args: { heading: 'An independent collection of experiments and unexpected discoveries.' } };
