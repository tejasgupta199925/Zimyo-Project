select p.name, sum(o.quantity) as units_sold
from products p join orders o on o.product_id=p.id
where month(o.orderdate)=8
group by p.id
order by units_sold desc
limit 10;
