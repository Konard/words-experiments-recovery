async ({ deep, require }) => {
  const React = require('react');
  const { useRef, useEffect, useState, useCallback } = React;
  // const { 
  //   Box,
  //   Input,
  //   Text, 
  //   Select
  // } = require('@chakra-ui/react');
  // const WordCloud = require('react-d3-cloud');
  // const { useLocalStore } = require('@deep-foundation/store/local');
  // const ResizeDetector = require('react-resize-detector');
  // const _ = require('lodash');
  // const { useSpaceId } = require('@deep-foundation/deepcase');
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

  // const Min = await deep.id('@deep-foundation/words-experiment', 'Min');
  // const Max = await deep.id('@deep-foundation/words-experiment', 'Max');
  // const Word = await deep.id('@deep-foundation/splitting-text-into-words-alt', 'Word');
  // const Count = await deep.id('@deep-foundation/splitting-text-into-words-alt', 'Count');
  // const Address = await deep.id('@deep-foundation/rss-to-deep', 'Address');
  // const Contain = await deep.id('@deep-foundation/core', 'Contain');
  // const rssTree = await deep.id('@deep-foundation/rss-to-deep', 'rssTree');


  const Content = React.memo(({ style, link }) => {
    //   const [selectedWords, setSelectedWords] = useLocalStore('wcsw', []);
    //   const [selectedAddresses, setSelectedAddresses] = useLocalStore('wcsa', []);
    //   // const [selectedWords, setSelectedWords] = useState([]);
    //   const { data: [min] } = deep.useDeepSubscription({
    //     type_id: Min, from_id: link.id,
    //   });
    //   const { data: [max] } = deep.useDeepSubscription({
    //     type_id: Max, from_id: link.id,
    //   });
    //   const { data: addresses } = deep.useDeepSubscription({
    //     type_id: Address,
    //     in: {
    //       type_id: Contain,
    //       from: {
    //         out: {
    //           type_id: Contain,
    //           to_id: link.id,
    //         },
    //       },
    //     },
    //   });
    //   // const whereAddresses = selectedAddresses?.length ? {
    //   //   from: { up: { tree_id: rssTree, parent_id: { _in: selectedAddresses } } },
    //   // } : {};
    //   // const { data: results } = deep.useDeepSubscription({
    //   //   _or: [
    //   //     {
    //   //       type_id: Word,
    //   //       in: {
    //   //         type_id: Count,
    //   //         number: { value: { _gte: 2 } },
    //   //         ...whereAddresses,
    //   //       },
    //   //     },
    //   //     {
    //   //       type_id: Count,
    //   //       number: { value: { _gte: 2 } },
    //   //       ...whereAddresses,
    //   //     },
    //   //   ]
    //   // });
    //   // console.log(whereAddresses);
    //   // const words = deep.useMinilinksSubscription({
    //   //   type_id: Word,
    //   // });
    //   const data = React.useMemo(() => {
    //     const wordIds = Object.keys((link?.value?.value || {}));
    //     return wordIds.filter(wid => link?.value?.value[wid]?.total > 1).map(wid => ({
    //       id: wid,
    //       text: link?.value?.value[wid]?.word,
    //       value: link?.value?.value[wid]?.total,
    //     }));
    //   }, [link]);
    //   const onWordClick = useCallback((e, w) => setSelectedWords((selectedWords = []) => selectedWords.includes(w.id) ? selectedWords.filter(i => i ! === w.id) : [...selectedWords, w.id]), []);
    //   const wordFontWeight = useCallback((w) => selectedWords.includes(w.id) ? 'bold' : 'normal', [selectedWords]);
    //   const wordFill = useCallback((w) => selectedWords.includes(w.id) ? '#fff' : '#b6b6b6', [selectedWords]);
    //   const wordRotate = useCallback((word) => word.value % 1, []);
    //   console.log({ selectedWords, data });
    //   const [size, setSize] = useState({ width: 0, height: 0 })

    //   const _min = new Date(min?.value?.value || (new Date()).valueOf());
    //   const _max = new Date(max?.value?.value || (new Date()).valueOf());
    //   const __min = (new Date(_min.getTime() - _min.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)
    //   const __max = (new Date(_max.getTime() - _max.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)

    //   const [wordValue, setWordValue] = useState('год');
    //   const [wordСount, setWordСount] = useState(10);
    //   const sliceData = data.slice(0, wordСount);
    //   const datasorting = sliceData.sort((a,b) => b.value - a.value);
    //   console.log('datasorting', datasorting);
    //   console.log('sliceData', sliceData);
    //   console.log('wordСount', wordСount);
    //   console.log('wordValue', wordValue);
    //   console.log('width', size.width);

    //   return <>
    //     <ResizeDetector
    //       handleWidth handleHeight
    //       onResize={(width, height) => setSize({ width, height })}
    //     >
    //       <Box sx={{ p: '1rem', ...style, position: 'relative', background: 'backgroundModal' }}>
    //         <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(8rem, 1fr))' columnGap='0.5rem' rowGap='0.5rem' mb='2rem'>
    //           <Input 
    //             placeholder='Количество слов'
    //             value={wordСount}
    //             type='number'
    //             onChange={e => {
    //               setWordСount(e.target.value);
    //               console.log('wordСount', wordСount);
    //             }}
    //           />
    //           <Input
    //             value={__min}
    //             onChange={async (e) => {
    //               const t = new Date(e.target.value).valueOf();
    //               const { data: founded } = await deep.select({
    //                 type_id: Min, from_id: link.id, to_id: link.id
    //               });
    //               if (founded.length) deep.update({ link_id: founded[0]?.id }, { value: t }, { table: 'numbers' });
    //               else deep.insert({ type_id: Min, from_id: link.id, to_id: link.id, number: { data: { value: t } } });
    //             }}
    //             placeholder="min"
    //             size="md"
    //             type="datetime-local"
    //             placeholder='Дата с'
    //           />
    //           <Input
    //             value={__max}
    //             onChange={async (e) => {
    //               const t = new Date(e.target.value).valueOf();
    //               const { data: founded } = await deep.select({
    //                 type_id: Max, from_id: link.id, to_id: link.id
    //               });
    //               if (founded.length) deep.update({ link_id: founded[0]?.id }, { value: t }, { table: 'numbers' });
    //               else deep.insert({ type_id: Max, from_id: link.id, to_id: link.id, number: { data: { value: t } } });
    //             }}
    //             placeholder="max"
    //             size="md"
    //             type="datetime-local"
    //             placeholder='Дата по'
    //           />
    //           <Select placeholder='Источник'>
    //             <option value='option1'>Option 1</option>
    //             <option value='option2'>Option 2</option>
    //             <option value='option3'>Option 3</option>
    //           </Select>
    //           <Input 
    //             placeholder='Слово'
    //             value={wordValue}
    //             type='text'
    //             onChange={e => setWordValue(e.target.value)}
    //           />
    //         </Box>

    //         <ResponsiveContainer 
    //           width="100%" height={300}
    //         >
    //           <BarChart
    //             layout="vertical"
    //             data={datasorting}
    //             margin={{
    //               top: 5,
    //               right: 10,
    //               left: 72,
    //               bottom: 15
    //             }}
    //             barSize={10}
    //           >
    //             <CartesianGrid
    //               strokeDasharray="0"
    //               stroke="#f5f5f5"
    //               verticalCoordinatesGenerator={(props) => (props.width > 550) ? [150, 300, 450] : [200, 350]}
    //               horizontal={false}
    //             />
    //             <XAxis tickLine={false} tick={true} type="number" domain={[0, 'dataMax + 10']} />
    //             <YAxis dataKey="text" type="category" />
    //             <YAxis
    //               orientation="right"
    //               yAxisId={1}
    //               dataKey="value"
    //               type="category"
    //               domain={["dataMax", "dataMix"]}
    //               tickLine={false}
    //             />
    //             <Tooltip />
    //             <Bar dataKey="value" fill="#8884d8" />
    //           </BarChart>
    //         </ResponsiveContainer>
    //       </Box>
    //     </ResizeDetector>
    //   </>;
    return <div>4</div>;
  }, (prev, next) => _.isEqual(prev.link.value, next.link.value));
  return ({ style, link }) => {
    // return <div>3</div>;
    return <Content link={link} style={{ width: 500, height: 500, ...style }} />;
  };
}