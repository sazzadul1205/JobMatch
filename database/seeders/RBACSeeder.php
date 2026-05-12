<?php
// database/seeders/RBACSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RBACSeeder extends Seeder
{
  public function run(): void
  {
    // Get super admin user (first admin user created)
    $superAdmin = DB::table('users')->where('email', 'superadmin@jobportal.com')->first();
    $adminUser = DB::table('users')->where('email', 'admin@jobportal.com')->first();
    $createdBy = $superAdmin?->id ?? $adminUser?->id ?? 1;

    // Insert Permissions - ADDED MORE PERMISSIONS FOR SIDEBAR
    $permissions = [
      // Profile Module
      ['name' => 'View Own Profile', 'slug' => 'profile.view.own', 'module' => 'profile', 'action' => 'view_own'],
      ['name' => 'Edit Own Profile', 'slug' => 'profile.edit.own', 'module' => 'profile', 'action' => 'edit_own'],
      ['name' => 'Delete Own Profile', 'slug' => 'profile.delete.own', 'module' => 'profile', 'action' => 'delete_own'],
      ['name' => 'View Any Profile', 'slug' => 'profile.view.any', 'module' => 'profile', 'action' => 'view_any'],
      ['name' => 'Edit Any Profile', 'slug' => 'profile.edit.any', 'module' => 'profile', 'action' => 'edit_any'],
      ['name' => 'Delete Any Profile', 'slug' => 'profile.delete.any', 'module' => 'profile', 'action' => 'delete_any'],

      // Job Module
      ['name' => 'Create Job', 'slug' => 'job.create', 'module' => 'job', 'action' => 'create'],
      ['name' => 'View Own Jobs', 'slug' => 'job.view.own', 'module' => 'job', 'action' => 'view_own'],
      ['name' => 'View Any Job', 'slug' => 'job.view.any', 'module' => 'job', 'action' => 'view_any'],
      ['name' => 'Edit Own Job', 'slug' => 'job.edit.own', 'module' => 'job', 'action' => 'edit_own'],
      ['name' => 'Edit Any Job', 'slug' => 'job.edit.any', 'module' => 'job', 'action' => 'edit_any'],
      ['name' => 'Delete Own Job', 'slug' => 'job.delete.own', 'module' => 'job', 'action' => 'delete_own'],
      ['name' => 'Delete Any Job', 'slug' => 'job.delete.any', 'module' => 'job', 'action' => 'delete_any'],
      ['name' => 'Publish Job', 'slug' => 'job.publish', 'module' => 'job', 'action' => 'publish'],
      ['name' => 'Expire Job', 'slug' => 'job.expire', 'module' => 'job', 'action' => 'expire'],

      // Application Module
      ['name' => 'View Own Applications', 'slug' => 'application.view.own', 'module' => 'application', 'action' => 'view_own'],
      ['name' => 'View Applications for Own Jobs', 'slug' => 'application.view.for_own_jobs', 'module' => 'application', 'action' => 'view_for_own_jobs'],
      ['name' => 'View Any Application', 'slug' => 'application.view.any', 'module' => 'application', 'action' => 'view_any'],
      ['name' => 'Shortlist Application', 'slug' => 'application.shortlist', 'module' => 'application', 'action' => 'shortlist'],
      ['name' => 'Reject Application', 'slug' => 'application.reject', 'module' => 'application', 'action' => 'reject'],
      ['name' => 'Hire Application', 'slug' => 'application.hire', 'module' => 'application', 'action' => 'hire'],
      ['name' => 'Add Employer Notes', 'slug' => 'application.add_notes', 'module' => 'application', 'action' => 'add_notes'],
      ['name' => 'Apply to Job', 'slug' => 'application.apply', 'module' => 'application', 'action' => 'apply'],
      ['name' => 'Withdraw Application', 'slug' => 'application.withdraw', 'module' => 'application', 'action' => 'withdraw'],

      // Category Module
      ['name' => 'View Categories', 'slug' => 'category.view', 'module' => 'category', 'action' => 'view'],
      ['name' => 'Create Category', 'slug' => 'category.create', 'module' => 'category', 'action' => 'create'],
      ['name' => 'Edit Category', 'slug' => 'category.edit', 'module' => 'category', 'action' => 'edit'],
      ['name' => 'Delete Category', 'slug' => 'category.delete', 'module' => 'category', 'action' => 'delete'],

      // Location Module
      ['name' => 'View Locations', 'slug' => 'location.view', 'module' => 'location', 'action' => 'view'],
      ['name' => 'Create Location', 'slug' => 'location.create', 'module' => 'location', 'action' => 'create'],
      ['name' => 'Edit Location', 'slug' => 'location.edit', 'module' => 'location', 'action' => 'edit'],
      ['name' => 'Delete Location', 'slug' => 'location.delete', 'module' => 'location', 'action' => 'delete'],

      // User Management Module
      ['name' => 'View Users', 'slug' => 'user.view', 'module' => 'user', 'action' => 'view'],
      ['name' => 'Create User', 'slug' => 'user.create', 'module' => 'user', 'action' => 'create'],
      ['name' => 'Edit User', 'slug' => 'user.edit', 'module' => 'user', 'action' => 'edit'],
      ['name' => 'Delete User', 'slug' => 'user.delete', 'module' => 'user', 'action' => 'delete'],
      ['name' => 'Suspend User', 'slug' => 'user.suspend', 'module' => 'user', 'action' => 'suspend'],
      ['name' => 'Assign Roles', 'slug' => 'user.assign_roles', 'module' => 'user', 'action' => 'assign_roles'],

      // Role Management Module
      ['name' => 'View Roles', 'slug' => 'role.view', 'module' => 'role', 'action' => 'view'],
      ['name' => 'Create Role', 'slug' => 'role.create', 'module' => 'role', 'action' => 'create'],
      ['name' => 'Edit Role', 'slug' => 'role.edit', 'module' => 'role', 'action' => 'edit'],
      ['name' => 'Delete Role', 'slug' => 'role.delete', 'module' => 'role', 'action' => 'delete'],
      ['name' => 'Assign Permissions', 'slug' => 'role.assign_permissions', 'module' => 'role', 'action' => 'assign_permissions'],

      // Report Module
      ['name' => 'View Job Reports', 'slug' => 'report.jobs', 'module' => 'report', 'action' => 'jobs'],
      ['name' => 'View Application Reports', 'slug' => 'report.applications', 'module' => 'report', 'action' => 'applications'],
      ['name' => 'View User Reports', 'slug' => 'report.users', 'module' => 'report', 'action' => 'users'],
      ['name' => 'Export Reports', 'slug' => 'report.export', 'module' => 'report', 'action' => 'export'],

      // Dashboard Module
      ['name' => 'View Admin Dashboard', 'slug' => 'dashboard.admin', 'module' => 'dashboard', 'action' => 'admin'],
      ['name' => 'View Employer Dashboard', 'slug' => 'dashboard.employer', 'module' => 'dashboard', 'action' => 'employer'],
      ['name' => 'View Job Seeker Dashboard', 'slug' => 'dashboard.job_seeker', 'module' => 'dashboard', 'action' => 'job_seeker'],

      // CV Module
      ['name' => 'Upload CV', 'slug' => 'cv.upload', 'module' => 'cv', 'action' => 'upload'],
      ['name' => 'Delete CV', 'slug' => 'cv.delete', 'module' => 'cv', 'action' => 'delete'],
      ['name' => 'Set Primary CV', 'slug' => 'cv.set_primary', 'module' => 'cv', 'action' => 'set_primary'],
      ['name' => 'View CVs', 'slug' => 'cv.view', 'module' => 'cv', 'action' => 'view'],
      ['name' => 'Download CV', 'slug' => 'cv.download', 'module' => 'cv', 'action' => 'download'],

      // NEW: Notifications Module
      ['name' => 'View Notifications', 'slug' => 'notification.view', 'module' => 'notification', 'action' => 'view'],
      ['name' => 'Mark Notifications Read', 'slug' => 'notification.mark_read', 'module' => 'notification', 'action' => 'mark_read'],

      // NEW: Statistics/Reports Module
      ['name' => 'View Statistics', 'slug' => 'statistics.view', 'module' => 'statistics', 'action' => 'view'],
      ['name' => 'Export Statistics', 'slug' => 'statistics.export', 'module' => 'statistics', 'action' => 'export'],
    ];

    foreach ($permissions as $permission) {
      DB::table('permissions')->updateOrInsert(
        ['slug' => $permission['slug']],
        array_merge($permission, [
          'created_at' => now(),
          'updated_at' => now(),
        ])
      );
    }

    // Insert Roles
    $roles = [
      [
        'name' => 'Super Admin',
        'slug' => 'super-admin',
        'description' => 'Full system access with all permissions',
        'level' => 100,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'Admin',
        'slug' => 'admin',
        'description' => 'Administrative access with most permissions',
        'level' => 80,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'Employer Admin',
        'slug' => 'employer-admin',
        'description' => 'Full employer access for company',
        'level' => 50,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'HR Manager',
        'slug' => 'hr-manager',
        'description' => 'HR staff who can manage jobs and applications',
        'level' => 40,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'Recruiter',
        'slug' => 'recruiter',
        'description' => 'Recruiter who can post jobs and review applications',
        'level' => 30,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'Job Seeker',
        'slug' => 'job-seeker',
        'description' => 'Regular job seeker who can apply to jobs',
        'level' => 10,
        'is_default' => true,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
      [
        'name' => 'Viewer',
        'slug' => 'viewer',
        'description' => 'Read-only access to public job listings',
        'level' => 5,
        'is_default' => false,
        'is_active' => true,
        'created_by' => $createdBy,
        'updated_by' => $createdBy,
      ],
    ];

    foreach ($roles as $role) {
      DB::table('roles')->updateOrInsert(
        ['slug' => $role['slug']],
        array_merge($role, [
          'created_at' => now(),
          'updated_at' => now(),
        ])
      );
    }

    // Get role IDs after upsert
    $superAdminRoleId = DB::table('roles')->where('slug', 'super-admin')->value('id');
    $adminRoleId = DB::table('roles')->where('slug', 'admin')->value('id');
    $employerAdminRoleId = DB::table('roles')->where('slug', 'employer-admin')->value('id');
    $hrManagerRoleId = DB::table('roles')->where('slug', 'hr-manager')->value('id');
    $recruiterRoleId = DB::table('roles')->where('slug', 'recruiter')->value('id');
    $jobSeekerRoleId = DB::table('roles')->where('slug', 'job-seeker')->value('id');
    $viewerRoleId = DB::table('roles')->where('slug', 'viewer')->value('id');

    // Clear existing role_permissions for these roles
    DB::table('role_permissions')->whereIn('role_id', [
      $superAdminRoleId,
      $adminRoleId,
      $employerAdminRoleId,
      $hrManagerRoleId,
      $recruiterRoleId,
      $jobSeekerRoleId,
      $viewerRoleId
    ])->delete();

    // Get all permission IDs
    $allPermissionIds = DB::table('permissions')->pluck('id');

    // Super Admin gets all permissions
    foreach ($allPermissionIds as $permissionId) {
      DB::table('role_permissions')->insert([
        'role_id' => $superAdminRoleId,
        'permission_id' => $permissionId,
        'granted' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // Admin permissions (same as Super Admin - full access)
    foreach ($allPermissionIds as $permissionId) {
      DB::table('role_permissions')->insert([
        'role_id' => $adminRoleId,
        'permission_id' => $permissionId,
        'granted' => true,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // Employer Admin permissions
    $employerAdminPermissions = [
      'profile.view.own',
      'profile.edit.own',
      'profile.delete.own',
      'job.create',
      'job.view.own',
      'job.edit.own',
      'job.delete.own',
      'job.publish',
      'application.view.for_own_jobs',
      'application.shortlist',
      'application.reject',
      'application.hire',
      'application.add_notes',
      'dashboard.employer',
      'cv.view',
      'cv.download',
      'notification.view',
      'notification.mark_read',
      'statistics.view',
    ];

    foreach ($employerAdminPermissions as $permSlug) {
      $permId = DB::table('permissions')->where('slug', $permSlug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->insert([
          'role_id' => $employerAdminRoleId,
          'permission_id' => $permId,
          'granted' => true,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    // HR Manager permissions
    $hrManagerPermissions = [
      'profile.view.own',
      'profile.edit.own',
      'job.create',
      'job.view.own',
      'job.edit.own',
      'job.delete.own',
      'application.view.for_own_jobs',
      'application.shortlist',
      'application.reject',
      'application.add_notes',
      'dashboard.employer',
      'cv.view',
      'cv.download',
      'notification.view',
      'notification.mark_read',
    ];

    foreach ($hrManagerPermissions as $permSlug) {
      $permId = DB::table('permissions')->where('slug', $permSlug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->insert([
          'role_id' => $hrManagerRoleId,
          'permission_id' => $permId,
          'granted' => true,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    // Recruiter permissions (limited)
    $recruiterPermissions = [
      'profile.view.own',
      'profile.edit.own',
      'job.create',
      'job.view.own',
      'job.edit.own',
      'application.view.for_own_jobs',
      'application.shortlist',
      'application.reject',
      'dashboard.employer',
      'cv.view',
      'cv.download',
      'notification.view',
    ];

    foreach ($recruiterPermissions as $permSlug) {
      $permId = DB::table('permissions')->where('slug', $permSlug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->insert([
          'role_id' => $recruiterRoleId,
          'permission_id' => $permId,
          'granted' => true,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    // Job Seeker permissions
    $jobSeekerPermissions = [
      'profile.view.own',
      'profile.edit.own',
      'profile.delete.own',
      'job.view.any',
      'application.view.own',
      'application.apply',
      'application.withdraw',
      'dashboard.job_seeker',
      'cv.upload',
      'cv.delete',
      'cv.set_primary',
      'cv.view',
      'notification.view',
      'notification.mark_read',
    ];

    foreach ($jobSeekerPermissions as $permSlug) {
      $permId = DB::table('permissions')->where('slug', $permSlug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->insert([
          'role_id' => $jobSeekerRoleId,
          'permission_id' => $permId,
          'granted' => true,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    // Viewer permissions (read-only)
    $viewerPermissions = [
      'job.view.any',
      'category.view',
      'location.view',
      'notification.view',
    ];

    foreach ($viewerPermissions as $permSlug) {
      $permId = DB::table('permissions')->where('slug', $permSlug)->value('id');
      if ($permId) {
        DB::table('role_permissions')->insert([
          'role_id' => $viewerRoleId,
          'permission_id' => $permId,
          'granted' => true,
          'created_at' => now(),
          'updated_at' => now(),
        ]);
      }
    }

    // Clear existing role_module_access
    DB::table('role_module_access')->whereIn('role_id', [
      $superAdminRoleId,
      $adminRoleId,
      $employerAdminRoleId,
      $hrManagerRoleId,
      $recruiterRoleId,
      $jobSeekerRoleId,
      $viewerRoleId
    ])->delete();

    // Set Role Module Access
    $moduleAccess = [
      // Super Admin - Full access to everything
      ['role_id' => $superAdminRoleId, 'module' => 'profile', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'job', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'application', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'category', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'location', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'user', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'role', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'report', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'dashboard', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'cv', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'notification', 'access_level' => 'manage'],
      ['role_id' => $superAdminRoleId, 'module' => 'statistics', 'access_level' => 'manage'],

      // Admin - Full access to everything
      ['role_id' => $adminRoleId, 'module' => 'profile', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'job', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'application', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'category', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'location', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'user', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'role', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'report', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'dashboard', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'cv', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'notification', 'access_level' => 'manage'],
      ['role_id' => $adminRoleId, 'module' => 'statistics', 'access_level' => 'manage'],

      // Employer Admin - Write access to job and application modules
      ['role_id' => $employerAdminRoleId, 'module' => 'profile', 'access_level' => 'write'],
      ['role_id' => $employerAdminRoleId, 'module' => 'job', 'access_level' => 'write'],
      ['role_id' => $employerAdminRoleId, 'module' => 'application', 'access_level' => 'write'],
      ['role_id' => $employerAdminRoleId, 'module' => 'category', 'access_level' => 'read'],
      ['role_id' => $employerAdminRoleId, 'module' => 'location', 'access_level' => 'read'],
      ['role_id' => $employerAdminRoleId, 'module' => 'report', 'access_level' => 'read'],
      ['role_id' => $employerAdminRoleId, 'module' => 'dashboard', 'access_level' => 'write'],
      ['role_id' => $employerAdminRoleId, 'module' => 'cv', 'access_level' => 'read'],
      ['role_id' => $employerAdminRoleId, 'module' => 'notification', 'access_level' => 'write'],
      ['role_id' => $employerAdminRoleId, 'module' => 'statistics', 'access_level' => 'read'],

      // HR Manager - Write access to job and application modules (limited)
      ['role_id' => $hrManagerRoleId, 'module' => 'profile', 'access_level' => 'write'],
      ['role_id' => $hrManagerRoleId, 'module' => 'job', 'access_level' => 'write'],
      ['role_id' => $hrManagerRoleId, 'module' => 'application', 'access_level' => 'write'],
      ['role_id' => $hrManagerRoleId, 'module' => 'category', 'access_level' => 'read'],
      ['role_id' => $hrManagerRoleId, 'module' => 'location', 'access_level' => 'read'],
      ['role_id' => $hrManagerRoleId, 'module' => 'dashboard', 'access_level' => 'write'],
      ['role_id' => $hrManagerRoleId, 'module' => 'cv', 'access_level' => 'read'],
      ['role_id' => $hrManagerRoleId, 'module' => 'notification', 'access_level' => 'write'],

      // Recruiter - Read/Write basic job functions
      ['role_id' => $recruiterRoleId, 'module' => 'profile', 'access_level' => 'write'],
      ['role_id' => $recruiterRoleId, 'module' => 'job', 'access_level' => 'write'],
      ['role_id' => $recruiterRoleId, 'module' => 'application', 'access_level' => 'write'],
      ['role_id' => $recruiterRoleId, 'module' => 'category', 'access_level' => 'read'],
      ['role_id' => $recruiterRoleId, 'module' => 'location', 'access_level' => 'read'],
      ['role_id' => $recruiterRoleId, 'module' => 'dashboard', 'access_level' => 'read'],
      ['role_id' => $recruiterRoleId, 'module' => 'cv', 'access_level' => 'read'],
      ['role_id' => $recruiterRoleId, 'module' => 'notification', 'access_level' => 'read'],

      // Job Seeker - Read/write own data only
      ['role_id' => $jobSeekerRoleId, 'module' => 'profile', 'access_level' => 'write'],
      ['role_id' => $jobSeekerRoleId, 'module' => 'job', 'access_level' => 'read'],
      ['role_id' => $jobSeekerRoleId, 'module' => 'application', 'access_level' => 'write'],
      ['role_id' => $jobSeekerRoleId, 'module' => 'dashboard', 'access_level' => 'read'],
      ['role_id' => $jobSeekerRoleId, 'module' => 'cv', 'access_level' => 'write'],
      ['role_id' => $jobSeekerRoleId, 'module' => 'notification', 'access_level' => 'read'],

      // Viewer - Read-only
      ['role_id' => $viewerRoleId, 'module' => 'job', 'access_level' => 'read'],
      ['role_id' => $viewerRoleId, 'module' => 'category', 'access_level' => 'read'],
      ['role_id' => $viewerRoleId, 'module' => 'location', 'access_level' => 'read'],
      ['role_id' => $viewerRoleId, 'module' => 'notification', 'access_level' => 'read'],
    ];

    foreach ($moduleAccess as $access) {
      DB::table('role_module_access')->insert([
        'role_id' => $access['role_id'],
        'module' => $access['module'],
        'access_level' => $access['access_level'],
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }

    // Assign roles to existing users based on their email patterns
    $users = DB::table('users')->whereNull('deleted_at')->get();

    foreach ($users as $user) {
      $roleSlug = 'job-seeker'; // Default role

      if ($user->email === 'superadmin@jobportal.com') {
        $roleSlug = 'super-admin';
      } elseif ($user->email === 'admin@jobportal.com') {
        $roleSlug = 'admin';
      } elseif ($user->email === 'hrmanager@company.com') {
        $roleSlug = 'hr-manager';
      } elseif (str_contains($user->email, '@company.com')) {
        $roleSlug = 'employer-admin';
      }

      $roleId = DB::table('roles')->where('slug', $roleSlug)->value('id');
      if ($roleId) {
        DB::table('user_roles')->updateOrInsert(
          ['user_id' => $user->id, 'role_id' => $roleId],
          [
            'assigned_by' => $createdBy,
            'assigned_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
          ]
        );
      }
    }
  }
}
