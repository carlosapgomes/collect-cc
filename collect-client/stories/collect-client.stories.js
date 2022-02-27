import { html } from 'lit-html';
import '../src/collect-client.js';

export default {
  title: 'CollectClient',
  component: 'collect-client',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template(args) {
  return html`
    <collect-client
      style="--collect-client-background-color: ${args.backgroundColor ||
      'white'}"
      ?_loggedIn=${args.loggedIn}
      ?_isAdmin=${args.isAdmin}
      ._user=${args.user}
    >
    </collect-client>
  `;
}

export const App = Template.bind({});
App.args = {
  loggedIn: false,
  isAdmin: false,
  user: null,
  backgroundColor: 'white',
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  loggedIn: true,
  isAdmin: false,
  user: {
    name: 'user.one',
  },
  backgroundColor: 'white',
};

export const Admin = Template.bind({});
Admin.args = {
  loggedIn: true,
  isAdmin: true,
  user: {
    name: 'user.admin',
  },
  backgroundColor: 'white',
};
