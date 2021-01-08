export const state = () => (
  [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
      width: 200
    },
    {
      text: 'Glass',
      align: 'start',
      sortable: true,
      value: 'glass',
      width: 200
    },
    {
      text: 'Tags',
      align: 'start',
      sortable: false,
      value: 'tags',
      width: 420
    },
    {
      text: 'Category',
      align: 'start',
      sortable: true,
      value: 'category',
    },
    {
      text: 'Alcoholic',
      align: 'center',
      sortable: true,
      value: 'alcoholic',
    },
    {text: '', value: 'data-table-expand'}
  ]
);
