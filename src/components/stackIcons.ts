import {
  siDocker,
  siExpress,
  siGit,
  siKubernetes,
  siLinux,
  siModelcontextprotocol,
  siMongodb,
  siNeo4j,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siRabbitmq,
  siReact,
  siRedis,
  siTypescript,
} from "simple-icons";

/* Named imports only — the package carries ~3,400 icons and a dynamic
   lookup would drag every one of them into the bundle. Shared by the
   desktop TechArc and the mobile StackStrip so the set stays in one place. */
export type Icon = { path: string; title: string };

export const ICONS: Record<string, Icon> = {
  docker: siDocker,
  express: siExpress,
  git: siGit,
  kubernetes: siKubernetes,
  linux: siLinux,
  modelcontextprotocol: siModelcontextprotocol,
  mongodb: siMongodb,
  neo4j: siNeo4j,
  nextdotjs: siNextdotjs,
  nginx: siNginx,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  rabbitmq: siRabbitmq,
  react: siReact,
  redis: siRedis,
  typescript: siTypescript,
};
