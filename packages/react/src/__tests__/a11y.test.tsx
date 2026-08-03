import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Select } from '../Select';
import { FilterBar } from '../FilterBar';
import { InfoTip } from '../InfoTip';
import { Switch } from '../Switch';
import { Spinner } from '../Spinner';
import { Divider } from '../Divider';
import { Chip } from '../Chip';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Avatar } from '../Avatar';
import { Skeleton } from '../Skeleton';
import { TiltCard } from '../TiltCard';
import { GradientBackground } from '../GradientBackground';
import { Spotlight } from '../Spotlight';
import { Sparkline } from '../Sparkline';
import { BarChart } from '../BarChart';
import { DonutChart } from '../DonutChart';
import { VisuallyHidden } from '../VisuallyHidden';
import { FunnelChart } from '../FunnelChart';
import { RadarChart } from '../RadarChart';
import { ScatterPlot } from '../ScatterPlot';
import { HeatmapChart } from '../HeatmapChart';
import { ParetoChart } from '../ParetoChart';
import { GaugeChart } from '../GaugeChart';
import { WordCloud } from '../WordCloud';
import { StackedLineChart } from '../StackedLineChart';

expect.extend(matchers);

describe('Accessibility', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button disabled has no a11y violations', async () => {
    const { container } = render(<Button variant="primary" disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('IconButton has no a11y violations', async () => {
    const { container } = render(<IconButton aria-label="Close">✕</IconButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input with label has no a11y violations', async () => {
    const { container } = render(<Input label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input with error has no a11y violations', async () => {
    const { container } = render(<Input label="Email" error="Required field" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Textarea with label has no a11y violations', async () => {
    const { container } = render(<Textarea label="Bio" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Select with label has no a11y violations', async () => {
    const { container } = render(
      <Select label="Team">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FilterBar with labelled selects has no a11y violations', async () => {
    const { container } = render(
      <FilterBar label="Team and season filters">
        <Select label="Team" orientation="horizontal">
          <option value="a">A</option>
        </Select>
        <Select label="Season" orientation="horizontal">
          <option value="2024">2024</option>
        </Select>
      </FilterBar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('InfoTip has no a11y violations', async () => {
    const { container } = render(<InfoTip content="More detail here" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Switch has no a11y violations', async () => {
    const { container } = render(<Switch checked aria-label="Notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Spinner has no a11y violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Divider has no a11y violations', async () => {
    const { container } = render(<Divider />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Chip has no a11y violations', async () => {
    const { container } = render(<Chip label="Tag" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Badge has no a11y violations', async () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Avatar with alt text has no a11y violations', async () => {
    const { container } = render(<Avatar fallback="PS" alt="Paul Sumido" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Skeleton has no a11y violations', async () => {
    const { container } = render(<Skeleton variant="text" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TiltCard has no a11y violations', async () => {
    const { container } = render(
      <TiltCard>
        <Card>
          <Card.Body>Tilt me</Card.Body>
        </Card>
      </TiltCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('GradientBackground has no a11y violations', async () => {
    const { container } = render(
      <GradientBackground>
        <p>Content on a gradient</p>
      </GradientBackground>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Spotlight has no a11y violations', async () => {
    const { container } = render(
      <Spotlight>
        <p>Content under a spotlight</p>
      </Spotlight>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Sparkline has no a11y violations', async () => {
    const { container } = render(<Sparkline data={[1, 4, 2, 8, 5]} label="Weekly signups" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BarChart has no a11y violations', async () => {
    const { container } = render(
      <BarChart data={[3, 6, 9]} labels={['Jan', 'Feb', 'Mar']} label="Sales by month" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('DonutChart has no a11y violations', async () => {
    const { container } = render(
      <DonutChart
        data={[
          { label: 'Online', value: 6 },
          { label: 'Offline', value: 2 },
        ]}
        label="Fleet health"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('VisuallyHidden has no a11y violations', async () => {
    const { container } = render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FunnelChart has no a11y violations', async () => {
    const { container } = render(
      <FunnelChart
        label="Signup funnel"
        data={[
          { label: 'Visit', value: 1000 },
          { label: 'Signup', value: 620 },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('RadarChart has no a11y violations', async () => {
    const { container } = render(
      <RadarChart
        label="Team profile"
        axes={['Speed', 'Power', 'Range']}
        data={[
          { label: 'Alpha', values: [10, 6, 8] },
          { label: 'Beta', values: [5, 9, 3] },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ScatterPlot has no a11y violations', async () => {
    const { container } = render(
      <ScatterPlot
        label="Load vs latency"
        series={[{ label: 'p95', points: [{ x: 1, y: 2 }, { x: 3, y: 5 }] }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('HeatmapChart has no a11y violations', async () => {
    const { container } = render(
      <HeatmapChart
        label="Cohort retention"
        matrix={[
          [100, 60],
          [100, 55],
        ]}
        rowLabels={['Jan', 'Feb']}
        colLabels={['W0', 'W1']}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ParetoChart has no a11y violations', async () => {
    const { container } = render(
      <ParetoChart
        label="Defects"
        data={[
          { label: 'Scratch', value: 50 },
          { label: 'Dent', value: 30 },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('GaugeChart has no a11y violations', async () => {
    const { container } = render(<GaugeChart label="Disk used" value={62} unit="%" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('GaugeChart with a status tone has no a11y violations', async () => {
    const { container } = render(
      <GaugeChart label="Disk used" value={94} unit="%" tone="critical" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('WordCloud has no a11y violations', async () => {
    const { container } = render(
      <WordCloud
        label="Topics"
        terms={[
          { text: 'typescript', weight: 40 },
          { text: 'angular', weight: 28 },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('StackedLineChart has no a11y violations', async () => {
    const { container } = render(
      <StackedLineChart
        label="Traffic"
        series={[
          { label: 'Organic', values: [10, 20, 30] },
          { label: 'Paid', values: [5, 10, 15] },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('StackedLineChart stacked variant has no a11y violations', async () => {
    const { container } = render(
      <StackedLineChart
        label="Traffic"
        variant="stacked"
        series={[
          { label: 'Organic', values: [10, 20, 30] },
          { label: 'Paid', values: [5, 10, 15] },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Sparkline with several series has no a11y violations', async () => {
    const { container } = render(
      <Sparkline label="Two teams" series={[[1, 5, 3], [2, 4, 8]]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
