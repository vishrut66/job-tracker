import React, { useState } from "react";

import BarChart from "./charts/BarChart";
import AreaChart from "./charts/AreaChart";
import { useAppContext } from "../../Context/appContext";
import Wrapper from "../../assets/wrappers/ChartsContainer";

export default function ChartsContainer() {
    const [barChart, setBarChart] = useState(true);
    const { monthlyApplications: data } = useAppContext();

    return (
        <Wrapper>
            <h4>Monthly Applications</h4>

            <button type="button" onClick={() => setBarChart(!barChart)}>
                {barChart ? "AreaChart" : "BarChart"}
            </button>
            {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
        </Wrapper>
    );
}