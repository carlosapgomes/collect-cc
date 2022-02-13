import { html } from 'lit-html';
import '../src/procs-view.js';
import { DateTime } from 'luxon';

export default {
  title: 'ProcsView',
  component: 'procs-view',
  argTypes: {},
};

function Template() {
  const procs = {};
  const data = [
    {
      descr: 'procedure 1',
      ptName: 'Patient Name 1',
      user1Name: 'Doctor Name 1',
      procStartDateTime: DateTime.local().toSQL(),
    },
    {
      descr: 'procedure 2',
      ptName: 'Patient Name 2',
      user1Name: 'Doctor Name 2',
      procStartDateTime: DateTime.local().toSQL(),
    },
  ];
  const user = {
    name: 'user1',
    id: 1,
    licenceNumber: '123412',
    isAdmin: true,
  };
  procs.data = [...data];
  procs.total = 2;
  procs.limit = 10;
  procs.skip = 0;
  return html`
    <procs-view .user="${user}" .procsres="${procs}"> </procs-view>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'ProcsView',
};
