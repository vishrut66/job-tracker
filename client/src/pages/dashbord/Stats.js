
import { useEffect } from "react";
import { useAppContext } from "../../Context/appContext";
import { StatsContainer, Loading, ChartsContainer } from "../../components/index.js";

const Stats = () => {
    const { showStats, isLoading, monthlyApplications } = useAppContext();

    useEffect(() => {
        showStats();
        // eslint-disable-next-line 
    }, []);

    if (isLoading) {
        return <Loading center />;
    }

    return (
        <>
            <StatsContainer />


            {monthlyApplications.length > 0 && <ChartsContainer />}
        </>
    );
};

export default Stats;