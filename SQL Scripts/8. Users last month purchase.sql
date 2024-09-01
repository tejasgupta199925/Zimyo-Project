with user_purchase as (
	select 
		u.id, u.name, max(o.orderdate) as last_purchase 
	from users u join orders o on o.users_id=u.id
	group by u.id, name
	order by name
),
target_users as (
	SELECT 
		id as tid, last_purchase 
	FROM user_purchase up
    WHERE (MONTH(up.last_purchase) = MONTH(CURDATE()) - 1 AND YEAR(up.last_purchase) =
YEAR(CURDATE()))
 	OR (MONTH(up.last_purchase) = 12 AND MONTH(CURDATE()) = 1 AND
YEAR(up.last_purchase) = YEAR(CURDATE()) - 1)
)
SELECT 
	u.id, u.name, u.city, u.country, date(tu.last_purchase) 
FROM target_users tu join users u on u.id=tu.tid;
