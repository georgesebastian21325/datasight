import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Header from '../components/global/header';
import { OptimizeObsolenceBtn, OptimizeRiskBtn, OptimizeFinanceBtn, OptimizeCapacityBtn } from '../components/button'



export default function EnterpriseArchitecture() {
    return (
        <div className='mt-[3rem]'>
            <Header />
            <main className="flex-grow p-6 ">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="aspect-[16/9] w-full border-2 rounded-lg overflow-hidden">

                    </div>
                    <div className='flex gap-x-5 justify-center'>
                        <OptimizeObsolenceBtn />
                        <OptimizeRiskBtn />
                        <OptimizeCapacityBtn />
                        <OptimizeFinanceBtn />
                    </div>
                </div>
            </main>
        </div>
    );
}
