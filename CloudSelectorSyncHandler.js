({ deep, data: { oldLink, newLink }, require }) => {
  const Count = Number(deep.id('@deep-foundation/splitting-text-into-words-alt', 'Count'));

  const link = newLink || oldLink;
  if (Number(link.type_id) !== Count || !link?.value?.value) return;

  const Cloud = Number(deep.id('@deep-foundation/words-experiment', 'Cloud'));
  const CloudAddress = Number(deep.id('@deep-foundation/words-experiment', 'CloudAddress'));
  const Word = Number(deep.id('@deep-foundation/splitting-text-into-words-alt', 'Word'));
  const clouds = plv8.execute(`SELECT id FROM links WHERE type_id=$1`, [Cloud]).map(n => Number(n.id));
  // const { data: clouds } = deep.select({ type_id: Cloud });
  for (let c of clouds) {
    const hash = {};
    const { data: ca } = deep.select({ type_id: CloudAddress, from_id: Number(c) });
    const { data: wCounts } = deep.select({ type_id: Count, to_id: Number(link.to_id) });
    for (let wc of wCounts) {
      const { data: [post] } = deep.select({ id: Number(wc.from_id) });
      const a = ca.find(ca => Number(post?.to_id) === Number(ca.to_id));
      // throw new Error(JSON.stringify({ a: Number(a?.id), post: Number(post?.id), ca: ca.map(a => Number(a.id)) }), null, 2);
      if (a) {
        let wordHash = deep.unsafe.plv8.execute(`SELECT (value->'${Number(wc.to_id)}') as jsonb FROM objects WHERE link_id=${Number(c)}`)?.[0]?.jsonb;
        // throw new Error(JSON.stringify(wordHash, null, 2));
        wordHash = wordHash || { word: (deep.select({ id: Number(wc.to_id) })?.data?.[0]?.value?.value || ''), total: 0, addresses: {} };
        wordHash.total += wc.value?.value || 0;
        wordHash.addresses[Number(a.to_id)] = (wordHash.addresses?.[Number(a.to_id)] || 0) + (wc.value?.value || 0);
        deep.unsafe.plv8.execute(`update objects set value = jsonb_set(value, '{${Number(wc.to_id)}}', '${JSON.stringify(wordHash)}') where link_id=${Number(c)}`)?.[0]?.jsonb;
      }
    }
    // if (Object.keys(hash).length) {
    // deep.update({ link_id: Number(c) }, { value: { ...(c.value.value || {}), ...hash } }, { table: 'objects' });
    // }
  }
}