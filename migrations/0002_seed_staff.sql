-- Bootstrap: seed the site owner as active Staff so the very first login
-- isn't stuck in the pending-approval queue with no staff to approve it.
INSERT INTO users (discord_id, username, tier, status)
VALUES ('660899468043878434', 'Owner', 'staff', 'active')
ON CONFLICT (discord_id) DO UPDATE SET tier = 'staff', status = 'active';
