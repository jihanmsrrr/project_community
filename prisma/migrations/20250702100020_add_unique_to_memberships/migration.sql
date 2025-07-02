/*
  Warnings:

  - A unique constraint covering the columns `[team_id,user_id]` on the table `team_memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `team_memberships_team_id_user_id_key` ON `team_memberships`(`team_id`, `user_id`);
