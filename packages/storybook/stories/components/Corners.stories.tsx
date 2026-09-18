import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Input, Badge, Avatar } from '@paul-portfolio/react';
const meta = { title: 'Foundations/ComponentCorners', parameters: { layout: 'padded' }, tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Surfaces: Story = { render: () => <div style={{ display: 'grid', gap: 24, maxWidth: 520 }}>
  <p>Continuous corners on surfaces. Circles and capsules keep their round geometry. Browsers without corner-shape retain standard rounded corners.</p>
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}><Button variant="primary">Primary button</Button><Button variant="outline">Outline button</Button></div>
  <Input aria-label="Example input" placeholder="Continuous input corners" />
  <Card><div style={{ padding: 24 }}>Card surface</div></Card>
  <div style={{ display: 'flex', gap: 16 }}><Badge>Capsule badge</Badge><Avatar fallback="PS" /></div>
  <div style={{ display: 'flex', gap: 16 }}><div style={{ width: 120, height: 120, borderRadius: 32, cornerShape: 'squircle', background: 'var(--paul-color-primary-600)' } as React.CSSProperties} /><div style={{ width: 120, height: 120, borderRadius: 32, cornerShape: 'round', background: 'var(--paul-color-primary-600)' } as React.CSSProperties} /></div>
  <p>Squircle (left), round (right).</p>
</div> };
