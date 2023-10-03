async ({ deep, require }) => {
  const React = require('react');
  const { useRef, useEffect, useState, useCallback } = React;
  const { Input, SimpleGrid, Box } = require('@chakra-ui/react');
  const WordCloud = require('react-d3-cloud');
  const { useLocalStore } = require('@deep-foundation/store/local');
  const ResizeDetector = require('react-resize-detector');
  const _ = require('lodash');
  const { useSpaceId } = require('@deep-foundation/deepcase');
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
    // const [selectedWords, setSelectedWords] = useState([]);
    const { data: [min] } = deep.useDeepSubscription({
      type_id: Min, from_id: link.id,
    });
    const { data: [max] } = deep.useDeepSubscription({
      type_id: Max, from_id: link.id,
    });
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
    // const whereAddresses = selectedAddresses?.length ? {
    //   from: { up: { tree_id: rssTree, parent_id: { _in: selectedAddresses } } },
    // } : {};
    // const { data: results } = deep.useDeepSubscription({
    //   _or: [
    //     {
    //       type_id: Word,
    //       in: {
    //         type_id: Count,
    //         number: { value: { _gte: 2 } },
    //         ...whereAddresses,
    //       },
    //     },
    //     {
    //       type_id: Count,
    //       number: { value: { _gte: 2 } },
    //       ...whereAddresses,
    //     },
    //   ]
    // });
    // console.log(whereAddresses);
    // const words = deep.useMinilinksSubscription({
    //   type_id: Word,
    // });
    const data = React.useMemo(() => {
      const wordIds = Object.keys((link?.value?.value || {}));
      return wordIds.map(wid => ({
        id: wid,
        text: link?.value?.value[wid]?.word,
        value: link?.value?.value[wid]?.total * 80,
      }));
    }, [link]);
    const onWordClick = useCallback((e, w) => setSelectedWords((selectedWords = []) => selectedWords.includes(w.id) ? selectedWords.filter(i => i! === w.id) : [...selectedWords, w.id]), []);
    const wordFontWeight = useCallback((w) => selectedWords.includes(w.id) ? 'bold' : 'normal', [selectedWords]);
    const wordFill = useCallback((w) => selectedWords.includes(w.id) ? '#fff' : '#b6b6b6', [selectedWords]);
    const wordRotate = useCallback((word) => word.value % 1, []);
    console.log({ selectedWords, data });
    const [size, setSize] = useState({ width: 0, height: 0 })

    const _min = new Date(min?.value?.value || (new Date()).valueOf());
    const _max = new Date(max?.value?.value || (new Date()).valueOf());
    const __min = (new Date(_min.getTime() - _min.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)
    const __max = (new Date(_max.getTime() - _max.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)

    return <>
      <ResizeDetector
        handleWidth handleHeight
        onResize={(width, height) => setSize({ width, height })}
      >
        <div style={{ ...style, position: 'relative', }}>
          <SimpleGrid columns={2} spacing={10} position="absolute" top={0} left={0} width="100%">
            <Box>
              <Input
                value={__min}
                onChange={async (e) => {
                  const t = new Date(e.target.value).valueOf();
                  const { data: founded } = await deep.select({
                    type_id: Min, from_id: link.id, to_id: link.id
                  });
                  if (founded.length) deep.update({ link_id: founded[0]?.id }, { value: t }, { table: 'numbers' });
                  else deep.insert({ type_id: Min, from_id: link.id, to_id: link.id, number: { data: { value: t } } });
                }}
                placeholder="min"
                size="md"
                type="datetime-local"
              />
            </Box>
            <Box>
              <Input
                value={__max}
                onChange={async (e) => {
                  const t = new Date(e.target.value).valueOf();
                  const { data: founded } = await deep.select({
                    type_id: Max, from_id: link.id, to_id: link.id
                  });
                  if (founded.length) deep.update({ link_id: founded[0]?.id }, { value: t }, { table: 'numbers' });
                  else deep.insert({ type_id: Max, from_id: link.id, to_id: link.id, number: { data: { value: t } } });
                }}
                placeholder="max"
                size="md"
                type="datetime-local"
              />
            </Box>
          </SimpleGrid>
          {<WordCloud
            data={data}
            width={size.width}
            height={size.height}
            fontWeight={wordFontWeight}
            fill={wordFill}
            rotate={wordRotate}
            onWordClick={onWordClick}
          />}
          <Box position="absolute" bottom={0} left={0} width="100%">
            <div>{addresses.map(a => <div style={{ color: selectedAddresses.includes(a.id) ? '#fff' : '#b6b6b6' }} onClick={() => setSelectedAddresses((sa = []) => sa.includes(a.id) ? sa.filter(s => s !== a.id) : [...sa, a.id])}>{a?.id} {a?.value?.value || ''}</div>)}</div>
            <div>{selectedWords.map(w => <><span onClick={() => setSelectedWords(selectedWords.filter(i => i != w))}>{w}</span>, </>)}</div>
            <div>
              {selectedWords.map(wid => {
                const w = deep.minilinks.byId[wid];
                const cs = w?.inByType[Count] || [];
                return <div>
                  <div>{wid} {w?.value?.value}</div>
                  <div style={{ paddingLeft: 16 }}>
                    {cs.map(c => <div>
                      {c?.value?.value} {c?.from_id} {(c?.from?.value?.value || '').slice(0, 30)}...
                    </div>)}
                  </div>
                </div>;
              })}
            </div>
          </Box>
        </div>
      </ResizeDetector>
    </>;
  }, (prev, next) => _.isEqual(prev.link.value, next.link.value));
  return ({ style, link }) => {
    return <Content link={link} style={{ width: 500, height: 500, ...style }} />;
  };
}