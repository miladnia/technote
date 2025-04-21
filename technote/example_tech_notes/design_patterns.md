# Design Patterns

- The one constant in software development is ***CHANGE***.
- No matter how well you design an application, over time an application must grow and change or it will _die_.
- Design Patterns give you **a shared vocabulary** with other developers.
- When you use a pattern in a description, other developers quickly know precisely the design you have in mind.

# Strategy Pattern

It defines a family of algorithms, encapsulates each one, and makes them interchangeable.

### Design Principles

> Identify the aspects of your application that vary and separate them from what stays the same.

> Program to an interface, not an implementation.

> Favor **composition** over inheritance.

### Code

```java
Duck model = new ModelDuck();
model.setFlyBehavior(new FlyRocketPowered());
model.performFly();
```

![the Ducks example](/static/examples_assets/strategy_pattern.jpg)

```java
public class ModelDuck extends Duck {
    public ModelDuck() {
        flyBehavior = new FlyNoWay();
        quackBehavior = new Quack();
    }
}
```

# Observer Pattern

It defines a one-to-many relationship between a set of objects. When the state of one object changes, all of its dependents are notified.

### Design Principles

> Strive for loosely coupled designs between objects that interact.

### Code

```java
WeatherData weatherData = new WeatherData();

var currentDisplay = new CurrentConditionsDisplay(weatherData);
var statisticsDisplay = new StatisticsDisplay(weatherData);
var forecastDisplay = new ForecastDisplay(weatherData);

// Simulate new weather measurements
weatherData.setMeasurements(80, 65, 30.4f);
```

![the Weather Station example](/static/examples_assets/observer_pattern.jpg)

```java
public class CurrentConditionsDisplay implements Observer, DisplayElement {
        public CurrentConditionsDisplay(WeatherData weatherData) {
                this.weatherData = weatherData;
                weatherData.registerObserver(this);
        }

        public void update(float temperature, float humidity, float pressure) {
            this.temperature = temperature;
            this.humidity = humidity;
            display();
        }
}
```

```java
public class WeatherData implements Subject {
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(temperature, humidity, pressure);
        }
    }
}
```

# Decorator Pattern

It attaches additional responsibilities to an object dynamically and provides a flexible alternative to subclassing for extending functionality.

### Design Principles

> **Open-Closed Principle:** Classes should be _open for extension_, but _closed for modification_.

### Code

```java
Beverage beverage = new DarkRoast();
beverage = new Mocha(beverage);
beverage = new Mocha(beverage);
beverage = new Whip(beverage);

System.out.println(
    beverage.getDescription() + " $" + beverage.cost());
```

![the Beverage example ](/static/examples_assets/decorator_pattern.jpg)

```java
public class Mocha extends CondimentDecorator {
    public double cost() {
        return beverage.cost() + .20;
    }
}
```

# References

- The _Head First Design Patterns_ book
