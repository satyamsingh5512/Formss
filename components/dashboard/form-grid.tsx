'use client'

import { motion } from 'framer-motion'
import { FormCard } from '@/components/form-card'
import { Form } from '@prisma/client'

interface FormWithCount extends Form {
    _count: {
        responses: number;
        questions: number;
    };
}

interface FormGridProps {
    forms: FormWithCount[];
}

export function FormGrid({ forms }: FormGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, index) => (
                <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                >
                    <FormCard form={form} />
                </motion.div>
            ))}
        </div>
    )
}
