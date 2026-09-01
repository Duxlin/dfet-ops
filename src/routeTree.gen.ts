/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuditRouteImport } from './routes/audit'
import { Route as LoginRouteImport } from './routes/login'
import { Route as NotificationsRouteImport } from './routes/notifications'
import { Route as ProfileRouteImport } from './routes/profile'
import { Route as ReportsRouteImport } from './routes/reports'
import { Route as AssetsIndexRouteImport } from './routes/assets/index'
import { Route as AssetsIdRouteImport } from './routes/assets/$id'
import { Route as StaffIndexRouteImport } from './routes/staff/index'
import { Route as StaffIdRouteImport } from './routes/staff/$id'
import { Route as TasksIndexRouteImport } from './routes/tasks/index'
import { Route as TasksIdRouteImport } from './routes/tasks/$id'
import { Route as ApiAuthSplatRouteImport } from './routes/api/auth/$'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuditRoute = AuditRouteImport.update({
  id: '/audit',
  path: '/audit',
  getParentRoute: () => rootRouteImport,
} as any)
const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const NotificationsRoute = NotificationsRouteImport.update({
  id: '/notifications',
  path: '/notifications',
  getParentRoute: () => rootRouteImport,
} as any)
const ProfileRoute = ProfileRouteImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRouteImport,
} as any)
const ReportsRoute = ReportsRouteImport.update({
  id: '/reports',
  path: '/reports',
  getParentRoute: () => rootRouteImport,
} as any)
const AssetsIndexRoute = AssetsIndexRouteImport.update({
  id: '/assets/',
  path: '/assets/',
  getParentRoute: () => rootRouteImport,
} as any)
const AssetsIdRoute = AssetsIdRouteImport.update({
  id: '/assets/$id',
  path: '/assets/$id',
  getParentRoute: () => rootRouteImport,
} as any)
const StaffIndexRoute = StaffIndexRouteImport.update({
  id: '/staff/',
  path: '/staff/',
  getParentRoute: () => rootRouteImport,
} as any)
const StaffIdRoute = StaffIdRouteImport.update({
  id: '/staff/$id',
  path: '/staff/$id',
  getParentRoute: () => rootRouteImport,
} as any)
const TasksIndexRoute = TasksIndexRouteImport.update({
  id: '/tasks/',
  path: '/tasks/',
  getParentRoute: () => rootRouteImport,
} as any)
const TasksIdRoute = TasksIdRouteImport.update({
  id: '/tasks/$id',
  path: '/tasks/$id',
  getParentRoute: () => rootRouteImport,
} as any)
const ApiAuthSplatRoute = ApiAuthSplatRouteImport.update({
  id: '/api/auth/$',
  path: '/api/auth/$',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/audit': typeof AuditRoute
  '/login': typeof LoginRoute
  '/notifications': typeof NotificationsRoute
  '/profile': typeof ProfileRoute
  '/reports': typeof ReportsRoute
  '/assets/$id': typeof AssetsIdRoute
  '/staff/$id': typeof StaffIdRoute
  '/tasks/$id': typeof TasksIdRoute
  '/assets/': typeof AssetsIndexRoute
  '/staff/': typeof StaffIndexRoute
  '/tasks/': typeof TasksIndexRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/audit': typeof AuditRoute
  '/login': typeof LoginRoute
  '/notifications': typeof NotificationsRoute
  '/profile': typeof ProfileRoute
  '/reports': typeof ReportsRoute
  '/assets/$id': typeof AssetsIdRoute
  '/staff/$id': typeof StaffIdRoute
  '/tasks/$id': typeof TasksIdRoute
  '/assets': typeof AssetsIndexRoute
  '/staff': typeof StaffIndexRoute
  '/tasks': typeof TasksIndexRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/audit': typeof AuditRoute
  '/login': typeof LoginRoute
  '/notifications': typeof NotificationsRoute
  '/profile': typeof ProfileRoute
  '/reports': typeof ReportsRoute
  '/assets/$id': typeof AssetsIdRoute
  '/staff/$id': typeof StaffIdRoute
  '/tasks/$id': typeof TasksIdRoute
  '/assets/': typeof AssetsIndexRoute
  '/staff/': typeof StaffIndexRoute
  '/tasks/': typeof TasksIndexRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/audit'
    | '/login'
    | '/notifications'
    | '/profile'
    | '/reports'
    | '/assets/$id'
    | '/staff/$id'
    | '/tasks/$id'
    | '/assets/'
    | '/staff/'
    | '/tasks/'
    | '/api/auth/$'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/audit'
    | '/login'
    | '/notifications'
    | '/profile'
    | '/reports'
    | '/assets/$id'
    | '/staff/$id'
    | '/tasks/$id'
    | '/assets'
    | '/staff'
    | '/tasks'
    | '/api/auth/$'
  id:
    | '__root__'
    | '/'
    | '/audit'
    | '/login'
    | '/notifications'
    | '/profile'
    | '/reports'
    | '/assets/$id'
    | '/staff/$id'
    | '/tasks/$id'
    | '/assets/'
    | '/staff/'
    | '/tasks/'
    | '/api/auth/$'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuditRoute: typeof AuditRoute
  LoginRoute: typeof LoginRoute
  NotificationsRoute: typeof NotificationsRoute
  ProfileRoute: typeof ProfileRoute
  ReportsRoute: typeof ReportsRoute
  AssetsIdRoute: typeof AssetsIdRoute
  StaffIdRoute: typeof StaffIdRoute
  TasksIdRoute: typeof TasksIdRoute
  AssetsIndexRoute: typeof AssetsIndexRoute
  StaffIndexRoute: typeof StaffIndexRoute
  TasksIndexRoute: typeof TasksIndexRoute
  ApiAuthSplatRoute: typeof ApiAuthSplatRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/audit': { id: '/audit'; path: '/audit'; fullPath: '/audit'; preLoaderRoute: typeof AuditRouteImport; parentRoute: typeof rootRouteImport }
    '/login': { id: '/login'; path: '/login'; fullPath: '/login'; preLoaderRoute: typeof LoginRouteImport; parentRoute: typeof rootRouteImport }
    '/notifications': { id: '/notifications'; path: '/notifications'; fullPath: '/notifications'; preLoaderRoute: typeof NotificationsRouteImport; parentRoute: typeof rootRouteImport }
    '/profile': { id: '/profile'; path: '/profile'; fullPath: '/profile'; preLoaderRoute: typeof ProfileRouteImport; parentRoute: typeof rootRouteImport }
    '/reports': { id: '/reports'; path: '/reports'; fullPath: '/reports'; preLoaderRoute: typeof ReportsRouteImport; parentRoute: typeof rootRouteImport }
    '/assets/': { id: '/assets/'; path: '/assets'; fullPath: '/assets/'; preLoaderRoute: typeof AssetsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/assets/$id': { id: '/assets/$id'; path: '/assets/$id'; fullPath: '/assets/$id'; preLoaderRoute: typeof AssetsIdRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/': { id: '/staff/'; path: '/staff'; fullPath: '/staff/'; preLoaderRoute: typeof StaffIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/staff/$id': { id: '/staff/$id'; path: '/staff/$id'; fullPath: '/staff/$id'; preLoaderRoute: typeof StaffIdRouteImport; parentRoute: typeof rootRouteImport }
    '/tasks/': { id: '/tasks/'; path: '/tasks'; fullPath: '/tasks/'; preLoaderRoute: typeof TasksIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/tasks/$id': { id: '/tasks/$id'; path: '/tasks/$id'; fullPath: '/tasks/$id'; preLoaderRoute: typeof TasksIdRouteImport; parentRoute: typeof rootRouteImport }
    '/api/auth/$': { id: '/api/auth/$'; path: '/api/auth/$'; fullPath: '/api/auth/$'; preLoaderRoute: typeof ApiAuthSplatRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  AuditRoute,
  LoginRoute,
  NotificationsRoute,
  ProfileRoute,
  ReportsRoute,
  AssetsIdRoute,
  StaffIdRoute,
  TasksIdRoute,
  AssetsIndexRoute,
  StaffIndexRoute,
  TasksIndexRoute,
  ApiAuthSplatRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { createStart } from '@tanstack/react-start'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
