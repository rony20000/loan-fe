import Slider from "@mui/material/Slider";
import classes from "./Calculator.module.css";
import { useEffect, useState } from "react";
import {BsFillTelephoneFill} from "react-icons/bs"
import {AiOutlineLoading3Quarters} from "react-icons/ai"

function valuetext(value: number) {
  return `${value}`;
}

function SliderComp({
  value,
  min,
  max,
  step,
  onUpdateVal,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onUpdateVal: (val: number) => void;
}) {
  const handleChangeVal = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      onUpdateVal(newValue);
    }
  };

  return (
    <Slider
      aria-label="Small steps"
      defaultValue={value}
      getAriaValueText={valuetext}
      step={step}
      marks
      min={min}
      max={max}
      valueLabelDisplay="auto"
      color="success"
      value={value}
      onChange={handleChangeVal}
    />
  );
}

export default function Calculator() {
  const [amount, setAmount] = useState(20000);
  const [months, setMonths] = useState(24);
  const [haveInsurance, setHaveInsurance] = useState(false);

  const [isLoading, setIsLoading] = useState(true)

  const [installment, setInstallment] = useState(0)

  useEffect(() => {
    const fetchCalc = async () => {
      setIsLoading(true)
      const res = await fetch("https://calculate-loan-server.onrender.com/api/calculate/", {
        method: "POST",
        body: JSON.stringify({amount: amount, months: months, insurance: haveInsurance}),
        headers: {
          "Content-Type": "application/json"
        }
      })

      setIsLoading(false)

      const data = await res.json()

      if(res.ok) {
        setInstallment(data.installment.toFixed(0))
      }
    }

    fetchCalc()
  }, [amount, months, haveInsurance])

  const handleChangeAmount = (val: number) => {
    if(val && val >= 20000 && val <= 800000) {
      setAmount(val)
    }
  }
  
  const handleChangeMonths = (val: number) => {
    if(val && val >= 24 && val <= 96) {
      setMonths(val)
    }
  }

  return (
    <form 
    className={classes.container}>
      <div className={classes.inputs}>
        <h3>Express loan with no hidden conditions</h3>

        <div className={classes.input}>
          <div>
            <p>Amount</p>
            <SliderComp
              key={1}
              min={20000}
              max={800000}
              step={10000}
              value={amount}
              onUpdateVal={handleChangeAmount}
            />
            <div className={classes.limit}>
              <p>20000 Kc</p>
              <p>800000 Kc</p>
            </div>
          </div>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              onBlur={() => amount < 20000 || amount > 800000 ? setAmount(20000): null }
            />
            <p>Kc</p>
          </div>
        </div>
        <div className={classes.input}>
          <div>
            <p>Time of installation</p>
            <SliderComp
              key={2}
              value={months}
              min={24}
              max={96}
              step={1}
              onUpdateVal={handleChangeMonths}
            />
            <div className={classes.limit}>
              <p>24</p>
              <p>96</p>
            </div>
          </div>
          <div>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(+e.target.value)}
              onBlur={() => months < 24 || months > 96 ? setMonths(24): null }
            />
            <p>Month</p>
          </div>
        </div>

        <div className={classes.insurance}>
          <p>insurance</p>
          <div>
            <div onClick={() => setHaveInsurance(true)}>
              <input type="radio" checked={haveInsurance} />
              <p>yes, i have insurance</p>
            </div>
            <div onClick={() => setHaveInsurance(false)}>
              <input type="radio" checked={!haveInsurance} />
              <p>no, i don't have insurance</p>
            </div>
          </div>
        </div>

        <p>
          Annual interest rate from <span>5.83%</span> / APR from{" "}
          <span>5.99%</span>
        </p>

        <p>
          The calculation is for reference only. You will get the exact
          calculation and parameters of your loan during the online application.
        </p>
      </div>

      <div className={classes.result}>
        <div className={classes.resultHeader}>
          <h4>Total a month</h4>
          {isLoading ? <AiOutlineLoading3Quarters /> : <h1>{installment} Kc</h1>}
        </div>
        <div className={classes.resultAction}>
          {isLoading ? <AiOutlineLoading3Quarters /> : <button type="button">Continue</button>}
          <div>
            <BsFillTelephoneFill />
            <p>laurem ipsum laurem</p>
          </div>
        </div>
      </div>
    </form>
  );
}
