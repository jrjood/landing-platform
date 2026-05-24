-- Keep a single payment plan row per project (lowest sortOrder/id), then enforce uniqueness
DELETE p1
FROM payment_plans p1
INNER JOIN payment_plans p2
  ON p1.projectId = p2.projectId
 AND (
   COALESCE(p1.sortOrder, 0) > COALESCE(p2.sortOrder, 0)
   OR (
     COALESCE(p1.sortOrder, 0) = COALESCE(p2.sortOrder, 0)
     AND p1.id > p2.id
   )
 );

ALTER TABLE payment_plans
  ADD UNIQUE KEY uq_payment_plans_projectId (projectId);
