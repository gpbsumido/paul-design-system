import type { Meta, StoryObj } from '@storybook/react';
import { SpiralPortraitHero, PerspectivePortraitHero, CorridorPortraitHero, Button, LiquidCarveButton } from '@paul-portfolio/react';
const images = [64, 65, 91, 177, 203, 219, 244, 250, 338, 342, 349, 399].map(id => ({ src: `https://picsum.photos/id/${id}/240/320` }));
const meta = {
  title: 'Sections/PortraitHeroes', component: SpiralPortraitHero, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Portrait-hero compositions made with token CSS. SpiralPortraitHero orbits the imagery around the copy like planets around the sun; PerspectivePortraitHero is a one-point-perspective corridor with the imagery as posters pasted on the walls; CorridorPortraitHero fans the imagery out to both sides. Decorative images never block the central copy or action slots. Empty and failed imagery leaves a complete section. No renderer dependencies.' } } },
  args: {
    heading: 'Meet the people behind every great idea.',
    description: 'A collection of independent voices, unexpected perspectives, and stories worth sharing.', images,
    actions: <><LiquidCarveButton label="Explore people" href="#people" /><Button variant="outline" href="#stories">View stories</Button></>,
    visual: <div aria-hidden="true" style={{ width: 80, height: 80, borderRadius: '50%', background: 'repeating-radial-gradient(circle, #191919 0 5px, #555 6px, #151515 9px)', boxShadow: '0 4px 16px #0004' }} />,
  },
} satisfies Meta<typeof SpiralPortraitHero>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Spiral: Story = {};
export const Tunnel: Story = {
  args: { heading: 'Elevating portraits through perspective.', description: 'Thoughtfully crafted portraits with refined lighting, style, and timeless storytelling.', visual: null,
    actions: <><Button variant="primary" href="#gallery">Explore gallery</Button><Button variant="outline" href="#booking">Book a shoot</Button></> },
  render: args => <div data-theme="dark"><PerspectivePortraitHero {...args} /></div>,
};
export const Corridor: Story = {
  args: { heading: 'The picture in your head, rendered before lunch.', description: 'Image generation for creative teams. Describe the shot, steer it with references and land a laid-out product on-brand.', visual: null,
    actions: <><LiquidCarveButton label="Start creating for free" href="#create" /></> },
  render: args => <div data-theme="dark"><CorridorPortraitHero {...args} /></div>,
};
export const Empty: Story = { args: { images: [], visual: null } };
export const LongCopy: Story = { args: { heading: 'An independent collection of extraordinary people and the stories that connect them across the world.' } };
