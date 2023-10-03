({ deep, data: { oldLink, newLink }, require }) => {
  // on change formula recalculate result
  const Contain = Number(deep.id('@deep-foundation/core', 'Contain'));
  const Address = Number(deep.id('@deep-foundation/rss-to-deep', 'Address'));
  const Data = Number(deep.id('@deep-foundation/rss-to-deep', 'Date'));
  const Count = Number(deep.id('@deep-foundation/splitting-text-into-words-alt', 'Count'));
  const Post = Number(deep.id('@deep-foundation/rss-to-deep', 'Post'));
  const CloudAddress = Number(deep.id('@deep-foundation/words-experiment', 'CloudAddress'));
  const Min = Number(deep.id('@deep-foundation/words-experiment', 'Min'));
  const Max = Number(deep.id('@deep-foundation/words-experiment', 'Max'));
  const { data: [cloud] } = deep.select({ id: newLink.from_id });
  const cloudValue = cloud?.value?.value || {};
  // throw new Error(JSON.stringify({ link_id: newLink.from_id, value: { ...cloudValue, test: newLink?.value?.value }, table: 'numbers' }));
  const { data: ca } = deep.select({ type_id: CloudAddress, from_id: Number(newLink.from_id) });
  const hash = {};
  for (let a of ca) {
    const { data: mins } = deep.select({ type_id: Min, from_id: Number(a.from_id) });
    const { data: maxs } = deep.select({ type_id: Max, from_id: Number(a.from_id) });
    const { data: posts } = deep.select({ type_id: Post, from_id: Number(a.to_id) });
    for (let p of posts) {
      const { data: dates } = deep.select({ type_id: Data, from_id: Number(p.id) });
      const min = mins[0]?.value?.value;
      const max = maxs[0]?.value?.value;
      const date = dates[0]?.value?.value;
      if (!(mins[0] && maxs[0] && dates[0]) || !(min <= date && max >= date)) continue;
      const { data: counts } = deep.select({ type_id: Count, from_id: Number(p.id) });
      for (let c of counts) {
        hash[Number(c.to_id)] = hash[Number(c.to_id)] || { word: (deep.select({ id: Number(c.to_id) })?.data?.[0]?.value?.value || ''), total: 0, addresses: {} };
        hash[Number(c.to_id)].total += c.value?.value || 0;
        hash[Number(c.to_id)].addresses[Number(a.to_id)] = (hash[Number(c.to_id)].addresses?.[Number(a.to_id)] || 0) + (c.value?.value || 0);
      }
    }
  }
  deep.update({ link_id: Number(newLink.from_id) }, { value: hash }, { table: 'objects' });
}