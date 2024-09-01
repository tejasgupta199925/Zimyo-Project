with review_votes_inner as (
	select 
		review_id, user_id,
		case when reaction=true then 1 else -1 end as upvote 
    from reviewvotes
),
review_votes_sum as (
	select 
		review_id, sum(upvote) as total_upvotes 
	from review_votes_inner 
    group by review_id
)
select 
	p.name as Product_name, 
    r.rating as Review_rating, 
    r.comment as Review_comment, 
    date(r.reviewdate) as review_date, 
    u.name as Reviewed_by, 
    rvs.total_upvotes
from products p join review r on r.product_id=p.id 
	join users u on u.id=r.user_id
	join review_votes_sum rvs on rvs.review_id=r.id
