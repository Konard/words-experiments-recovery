async ({ deep, require }) => {
  const React = require('react');
const { useRef, useEffect, useState, useCallback } = React;
const { Input, SimpleGrid, Box } = require('@chakra-ui/react');
const WordCloud = require('react-d3-cloud');
const { useLocalStore } = require('@deep-foundation/store/local');
const ResizeDetector = require('react-resize-detector');
const _ = require('lodash');
const { useSpaceId } = require('@deep-foundation/deepcase');
// const {
  //   BarChart,
//   Bar,
//   Brush,
//   ReferenceLine,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } = await deep.import('recharts');

const Min = await deep.id('@deep-foundation/words-experiment', 'Min');
const Max = await deep.id('@deep-foundation/words-experiment', 'Max');
const Word = await deep.id('@deep-foundation/splitting-text-into-words-alt', 'Word');
const Count = await deep.id('@deep-foundation/splitting-text-into-words-alt', 'Count');
const Address = await deep.id('@deep-foundation/rss-to-deep', 'Address');
const Contain = await deep.id('@deep-foundation/core', 'Contain');
const rssTree = await deep.id('@deep-foundation/rss-to-deep', 'rssTree');

const Content = React.memo(({ style, link }) => {
    const [selectedWords, setSelectedWords] = useLocalStore('wcsw', []);
  const [selectedAddresses, setSelectedAddresses] = useLocalStore('wcsa', []);
  const { data: addresses } = deep.useDeepSubscription({
      type_id: Address,
    in: {
        type_id: Contain,
      from: {
          out: {
            type_id: Contain,
          to_id: link.id,
      },
    },
  },
});
  return <>
    <ResizeDetector
      handleWidth handleHeight
      onResize={(width, height) => setSize({ width, height })}
    >
      <div style={{ ...style, position: 'relative', }}>
        <div>
          {addresses.map((a => (<div>{a.id} {a.value}</div>)))}
        </div>
      </div>
    </ResizeDetector>
  </>;
}, (prev, next) => _.isEqual(prev.link.value, next.link.value));
return ({ style, link }) => {
    return <Content link={link} style={{ width: 500, height: 500, ...style }}/>;
};
}