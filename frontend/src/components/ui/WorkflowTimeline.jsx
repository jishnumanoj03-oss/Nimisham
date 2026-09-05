import { motion } from 'framer-motion';
import { Clock, Cpu, MonitorPlay } from 'lucide-react';

const WorkflowTimeline = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return <p className="text-text-muted italic">No workflow steps documented yet.</p>;
  }

  return (
    <div className="relative pl-6 sm:pl-8 border-l border-border/50 py-4 space-y-12">
      {steps.sort((a, b) => a.orderIndex - b.orderIndex).map((step, index) => (
        <motion.div
          key={step._id || index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center group-hover:scale-125 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-xs font-mono text-accent uppercase tracking-wider mb-1 block">
                  Step {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-text-primary">{step.title}</h3>
              </div>
              
              <p className="text-text-secondary leading-relaxed">{step.description}</p>
              
              {/* Meta information */}
              {(step.software || step.duration) && (
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted pt-2">
                  {step.software && (
                    <div className="flex items-center">
                      <MonitorPlay size={14} className="mr-1.5 text-accent/70" />
                      {step.software}
                    </div>
                  )}
                  {step.duration && (
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1.5 text-accent/70" />
                      {step.duration}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Optional Image */}
            {step.image && step.image.url && (
              <div className="w-full sm:w-1/3 shrink-0 rounded-lg overflow-hidden border border-border mt-4 sm:mt-0">
                <img 
                  src={step.image.url} 
                  alt={step.title} 
                  className="w-full h-auto object-cover max-h-48"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkflowTimeline;
