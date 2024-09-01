select date(o.orderdate) as order_date, p.category, sum(p.price*o.quantity) as revenue 
from products p join orders o on p.id=o.product_id
group by order_date, category
order by order_date;
