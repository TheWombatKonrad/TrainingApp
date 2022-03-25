using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;

namespace TodoTester
{

    [TestClass]
    public class EdgeDriverTest
    {
        private const string edgeDriverDirectory = @"C:\";
        private const string trainingApp = "https://thewombatkonrad.github.io/TrainingApp/";

        private EdgeDriver browser;

        [TestInitialize]
        public void EdgeDriverInitialize()
        {
            browser = new EdgeDriver(edgeDriverDirectory);
            browser.Url = trainingApp;
        }

        [TestMethod]
        public void CheckAddTodo()
        {
            var searchInput = browser.FindElement(By.Id("new-todo"));

            searchInput.SendKeys("Test");
            searchInput.SendKeys(Keys.Enter);

            bool newTodo = browser.FindElement(By.CssSelector("#todo-list li")).Displayed;

            Assert.IsTrue(newTodo);
        }

        [TestMethod]
        public void CheckItemCounter()
        {
            var searchInput = browser.FindElement(By.Id("new-todo"));

            searchInput.SendKeys("Test");
            searchInput.SendKeys(Keys.Enter);

            var counter = browser.FindElement(By.CssSelector("#todo-count")).Text;

            Assert.AreEqual("1 item left", counter);

            var checkbox = browser.FindElement(By.CssSelector(".toggle-one"));

            checkbox.Click();

            counter = browser.FindElement(By.CssSelector(".todo-count")).Text;

            Assert.AreEqual("0 items left", counter);
        }

        [TestMethod]
        public void CheckItemCounterTwo()
        {
            var searchInput = browser.FindElement(By.Id("new-todo"));

            searchInput.SendKeys("Test");
            searchInput.SendKeys(Keys.Enter);

            searchInput.SendKeys("Test");
            searchInput.SendKeys(Keys.Enter);

            searchInput.SendKeys("Test");
            searchInput.SendKeys(Keys.Enter);

            var counter = browser.FindElement(By.CssSelector("#todo-count")).Text;

            var checkbox = browser.FindElement(By.CssSelector(".toggle-one"));

            checkbox.Click();

            counter = browser.FindElement(By.CssSelector(".todo-count")).Text;

            Assert.AreEqual("2 items left", counter);
        }

        [TestCleanup]
        public void EdgeDriverCleanup()
        {
            browser.Quit();
        }
    }//class

}
