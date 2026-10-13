// This validates the existing explicit lesson-completion response, not speech quality.
export async function confirmGuidedCompletion(submit,now=()=>new Date()){
 const result=await submit();
 if(!result||!Number.isFinite(result.totalXP)||!Number.isFinite(result.xpAwarded)||typeof result.alreadyCompleted!=='boolean')throw new Error('The server did not confirm course completion. Your local practice remains available.');
 return{result,activity:result.alreadyCompleted?null:{confirmed:true,completedAt:now().toISOString()}};
}
