import * as migration_20260729_161611_initial from './20260729_161611_initial';
import * as migration_20260729_164652_add_resources_collection from './20260729_164652_add_resources_collection';
import * as migration_20260729_205527_add_users_display_name_role from './20260729_205527_add_users_display_name_role';
import * as migration_20260730_201606_add_comments_collection from './20260730_201606_add_comments_collection';
import * as migration_20260730_203215_add_reports_collection from './20260730_203215_add_reports_collection';
import * as migration_20260730_204548_add_access_requests_collection from './20260730_204548_add_access_requests_collection';
import * as migration_20260730_210259_add_api_keys_collection from './20260730_210259_add_api_keys_collection';
import * as migration_20260730_214007_add_comments_author_name from './20260730_214007_add_comments_author_name';
import * as migration_20260731_000000_cascade_required_relationships from './20260731_000000_cascade_required_relationships';
import * as migration_20260821_071445_add_announcements_collection from './20260821_071445_add_announcements_collection';
import * as migration_20260821_074500_add_notifications_migration_history from './20260821_074500_add_notifications_migration_history';

export const migrations = [
  {
    up: migration_20260729_161611_initial.up,
    down: migration_20260729_161611_initial.down,
    name: '20260729_161611_initial',
  },
  {
    up: migration_20260729_164652_add_resources_collection.up,
    down: migration_20260729_164652_add_resources_collection.down,
    name: '20260729_164652_add_resources_collection',
  },
  {
    up: migration_20260729_205527_add_users_display_name_role.up,
    down: migration_20260729_205527_add_users_display_name_role.down,
    name: '20260729_205527_add_users_display_name_role',
  },
  {
    up: migration_20260730_201606_add_comments_collection.up,
    down: migration_20260730_201606_add_comments_collection.down,
    name: '20260730_201606_add_comments_collection',
  },
  {
    up: migration_20260730_203215_add_reports_collection.up,
    down: migration_20260730_203215_add_reports_collection.down,
    name: '20260730_203215_add_reports_collection',
  },
  {
    up: migration_20260730_204548_add_access_requests_collection.up,
    down: migration_20260730_204548_add_access_requests_collection.down,
    name: '20260730_204548_add_access_requests_collection',
  },
  {
    up: migration_20260730_210259_add_api_keys_collection.up,
    down: migration_20260730_210259_add_api_keys_collection.down,
    name: '20260730_210259_add_api_keys_collection',
  },
  {
    up: migration_20260730_214007_add_comments_author_name.up,
    down: migration_20260730_214007_add_comments_author_name.down,
    name: '20260730_214007_add_comments_author_name',
  },
  {
    up: migration_20260731_000000_cascade_required_relationships.up,
    down: migration_20260731_000000_cascade_required_relationships.down,
    name: '20260731_000000_cascade_required_relationships',
  },
  {
    up: migration_20260821_071445_add_announcements_collection.up,
    down: migration_20260821_071445_add_announcements_collection.down,
    name: '20260821_071445_add_announcements_collection'
  },
  {
    up: migration_20260821_074500_add_notifications_migration_history.up,
    down: migration_20260821_074500_add_notifications_migration_history.down,
    name: '20260821_074500_add_notifications_migration_history'
  },
];
