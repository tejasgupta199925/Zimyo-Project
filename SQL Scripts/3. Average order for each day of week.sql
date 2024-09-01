select dayofweek(o.orderdate) as day_of_week, avg(p.price*o.quantity) as average_order_value
from products p join orders o on o.product_id=p.id
group by dayofweek(o.orderdate);
