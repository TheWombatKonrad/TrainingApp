using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Support.UI;

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
        public void CheckThatListsHaveLoaded()
        {
            //the h3 is selected, and checked to see if it contains sit-ups (which is the first exercise in the list...)
            var exercise = browser.FindElement(By.CssSelector(".exercises-heading h3")).Text;
            Assert.AreEqual("Sit-ups", exercise);
        }

        [TestMethod]
        public void CheckThatItemGetsAdded()
        {
            //click the add exercise button
            browser.FindElement(By.CssSelector(".exercises-heading button")).Click();

            //check that the exercise got added to the workout
            var exercise = browser.FindElement(By.CssSelector("#workout ul li h3")).Text;
            Assert.AreEqual("Sit-ups", exercise);
        }

        [TestMethod]
        public void CheckWorkoutTimer()
        {
            //add the exercise to the workout
            browser.FindElement(By.CssSelector(".exercises-heading button")).Click();

            //start the workout
            browser.FindElement(By.Id("start")).Click();

            //check that the timer has started
            var timer = browser.FindElement(By.Id("overall-time")).Text;
            Assert.AreNotEqual("Total Workout Time:", timer);
        }

        [TestCleanup]
        public void EdgeDriverCleanup()
        {
            browser.Quit();
        }
    }//class

}
