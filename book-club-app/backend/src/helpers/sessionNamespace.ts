import { createNamespace, Namespace } from 'cls-hooked';

// session context namespace
// https://github.com/jeff-lewis/cls-hooked#readme
export const sessionNamespace: Namespace = createNamespace('current-user-session');
