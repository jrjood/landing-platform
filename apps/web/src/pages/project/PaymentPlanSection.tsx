import { motion } from 'framer-motion';
import type { Project } from '@/lib/api';
import { fadeUp, viewportOnce } from '@/lib/animations';
import {
  Wallet,
  CalendarRange,
  Clock3,
  Percent,
  BadgeDollarSign,
  Tag,
} from 'lucide-react';

interface PaymentPlanSectionProps {
  project: Project;
}

export function PaymentPlanSection({ project }: PaymentPlanSectionProps) {
  const plan = project.paymentPlans?.[0];

  const milestones = plan
    ? [
        {
          icon: BadgeDollarSign,
          value: plan.startingPrice || 'On Request',
          label: 'Starting Price',
        },
        {
          icon: Wallet,
          value: plan.downPayment || 'On Request',
          label: 'Down Payments',
        },
        {
          icon: CalendarRange,
          value: plan.installments || 'Flexible',
          label: 'Installments',
        },
        { icon: Clock3, value: plan.years || 'Flexible', label: 'Duration' },
        {
          icon: Percent,
          value: plan.deliveryDate || 'Announced by Phase',
          label: 'Delivery Date',
        },
        ...(plan.promotionalOffer
          ? [
              {
                icon: Tag,
                value: plan.promotionalOffer,
                label: plan.badge || 'Offer',
              },
            ]
          : []),
      ]
    : [];

  return (
    <motion.section
      id='payment-plan'
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      className='payment-plan-section'
    >
      <div className='container mx-auto px-4'>
        <motion.div
          variants={fadeUp}
          custom={0}
          className='payment-plan-section__header'
        >
          <p className='brand-eyebrow'>Payment Plan</p>
          <h2>Flexible Payment Options</h2>
        </motion.div>

        {milestones.length === 0 ? (
          <div className='master-payment__empty'>
            Payment details are available through the sales team.
          </div>
        ) : (
          <>
            <div className='payment-plan-section__grid'>
              {milestones.map((item, index) => (
                <motion.div
                  key={`${item.label}-${index}`}
                  variants={fadeUp}
                  custom={index * 0.04}
                  className='payment-plan-section__item'
                >
                  <item.icon className='payment-plan-section__icon' />
                  <strong>{item.value}</strong>
                  <small>{item.label}</small>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <p className='master-payment__note'>* Terms and conditions apply.</p>
      </div>
    </motion.section>
  );
}
